"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, orderItems, orders } from "@/shared/lib/db";
import { getDeliveryFee } from "@/features/settings/server/queries";
import { generateOrderNumber } from "@/features/orders/utils";
import { ORDERS_CACHE_TAG } from "@/features/orders/constants";
import { getCustomerSession } from "@/features/account/server/session";
import { refreshCustomerStats, upsertCustomerFromOrder } from "@/features/customers/server/service";
import { emitEvent } from "@/features/events/server/events";
import { startPayment } from "@/features/payments/server/service";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { ORDER_RATE_LIMIT, PICKUP_LABEL } from "../constants";
import { checkoutSchema } from "../schemas";
import type { PlacedOrder, PlaceOrderResult } from "../types";
import type { OnlineOperator } from "@/features/payments/types";
import { PricingError, priceCheckoutLines } from "./pricing";

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues
      .filter((issue) => issue.path[0] === "customer")
      .reduce<Record<string, string[]>>((acc, issue) => {
        const key = String(issue.path[1]);
        acc[key] = [...(acc[key] ?? []), issue.message];
        return acc;
      }, {});
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Informations invalides", fieldErrors };
  }

  if (!consumeRateLimit(`order:${await getClientIp()}`, ORDER_RATE_LIMIT)) {
    return { ok: false, error: "Trop de commandes envoyées. Réessayez dans quelques minutes." };
  }

  const sessionCustomer = await getCustomerSession().catch(() => null);
  if (!sessionCustomer) {
    return { ok: false, error: "Connectez-vous ou continuez sans compte pour valider votre commande." };
  }

  const { customer, deliveryMethod, paymentMethod, operator, checkoutKey, lines } = parsed.data;

  const existing = await findPlacedOrder(checkoutKey);
  if (existing) return { ok: true, order: await withPayment(existing, paymentMethod, operator) };
  const isPickup = deliveryMethod === "pickup";

  try {
    const [pricedLines, configuredFee] = await Promise.all([priceCheckoutLines(lines), getDeliveryFee()]);
    const deliveryFee = isPickup ? 0 : configuredFee;
    const subtotal = pricedLines.reduce((sum, line) => sum + line.lineTotal, 0);
    const total = subtotal + deliveryFee;
    const orderId = randomUUID();
    const orderNumber = generateOrderNumber();
    const customerRecord = await upsertCustomerFromOrder(customer).catch((error: unknown) => {
      console.error("upsertCustomerFromOrder failed", error);
      return null;
    });
    const claimedAt = customerRecord && sessionCustomer?.id === customerRecord.id ? new Date() : null;

    await db.batch([
      db.insert(orders).values({
        id: orderId,
        orderNumber,
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerPhone: customer.phone,
        customerEmail: customer.email || null,
        customerId: customerRecord?.id ?? null,
        claimedAt,
        checkoutKey,
        customerAddress: isPickup ? PICKUP_LABEL : customer.address,
        customerCommune: isPickup ? PICKUP_LABEL : customer.commune,
        customerNotes: customer.notes || null,
        paymentMethod: "cash",
        subtotal: String(subtotal),
        deliveryFee: String(deliveryFee),
        total: String(total),
        status: "pending",
        paymentStatus: "pending",
      }),
      db.insert(orderItems).values(
        pricedLines.map((line) => ({
          orderId,
          productId: line.productId,
          productName: line.name,
          productPrice: String(line.unitPrice),
          productImage: line.image,
          quantity: line.quantity,
          color: line.color,
          size: line.size,
          lotId: line.lotId,
          lotName: line.variant,
          itemId: line.itemId,
          priceLotId: line.priceLotId,
          lineTotal: String(line.lineTotal),
        }))
      ),
    ]);

    if (customerRecord) {
      await refreshCustomerStats(customerRecord.id).catch((error: unknown) =>
        console.error("refreshCustomerStats failed", error)
      );
      if (customerRecord.created) await emitEvent({ type: "customer.created", customerId: customerRecord.id });
    }
    await emitEvent({ type: "order.created", orderId, customerId: customerRecord?.id ?? null });

    updateTag(ORDERS_CACHE_TAG);

    const placed: PlacedOrder = {
      customer,
      deliveryMethod,
      paymentMethod,
      checkoutUrl: null,
      paymentError: null,
      orderNumber,
      lines: pricedLines,
      subtotal,
      deliveryFee,
      total,
    };
    return { ok: true, order: await withPayment({ id: orderId, placed }, paymentMethod, operator) };
  } catch (error) {
    if (error instanceof PricingError) return { ok: false, error: error.message };
    const replay = await findPlacedOrder(checkoutKey).catch(() => null);
    if (replay) return { ok: true, order: await withPayment(replay, paymentMethod, operator) };
    console.error("placeOrder failed", error);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }
}

async function withPayment(
  found: { id: string; placed: PlacedOrder },
  paymentMethod: PlacedOrder["paymentMethod"],
  operator: OnlineOperator | null
): Promise<PlacedOrder> {
  if (paymentMethod !== "online" || !operator) return found.placed;
  const payment = await startPayment(found.id, operator);
  return payment.ok
    ? { ...found.placed, paymentMethod, checkoutUrl: payment.checkoutUrl }
    : { ...found.placed, paymentMethod, paymentError: payment.error };
}

async function findPlacedOrder(checkoutKey: string): Promise<{ id: string; placed: PlacedOrder } | null> {
  const order = await db.query.orders.findFirst({ where: eq(orders.checkoutKey, checkoutKey), with: { items: true } });
  if (!order) return null;
  const isPickup = order.customerAddress === PICKUP_LABEL;
  return {
    id: order.id,
    placed: {
      customer: {
        firstName: order.customerFirstName,
        lastName: order.customerLastName,
        phone: order.customerPhone,
        email: order.customerEmail ?? "",
        commune: isPickup ? "" : (order.customerCommune ?? ""),
        address: isPickup ? "" : order.customerAddress,
        notes: order.customerNotes ?? "",
      },
      deliveryMethod: isPickup ? "pickup" : "delivery",
      paymentMethod: order.paymentMethod === "online" ? "online" : "cash",
      checkoutUrl: null,
      paymentError: null,
      orderNumber: order.orderNumber,
      lines: order.items.map((item) => ({
        productId: item.productId,
        lotId: item.lotId,
        priceLotId: item.priceLotId,
        itemId: item.itemId,
        name: item.productName,
        variant: item.lotName,
        color: item.color,
        size: item.size,
        image: item.productImage,
        unitPrice: Number(item.productPrice),
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
      })),
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
    },
  };
}
