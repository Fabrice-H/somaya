"use server";

import { randomUUID } from "crypto";
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
import type { PlaceOrderResult } from "../types";
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

  const { customer, deliveryMethod, paymentMethod, operator, lines } = parsed.data;
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

    let checkoutUrl: string | null = null;
    let paymentError: string | null = null;
    if (paymentMethod === "online" && operator) {
      const payment = await startPayment(orderId, operator);
      if (payment.ok) checkoutUrl = payment.checkoutUrl;
      else paymentError = payment.error;
    }

    return {
      ok: true,
      order: {
        customer,
        deliveryMethod,
        paymentMethod,
        checkoutUrl,
        paymentError,
        orderNumber,
        lines: pricedLines,
        subtotal,
        deliveryFee,
        total,
      },
    };
  } catch (error) {
    if (error instanceof PricingError) return { ok: false, error: error.message };
    console.error("placeOrder failed", error);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }
}
