"use server";

import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";
import { db, orderItems, orders } from "@/shared/lib/db";
import { getDeliveryFee } from "@/features/settings/server/queries";
import { generateOrderNumber } from "@/features/orders/utils";
import { ORDERS_CACHE_TAG } from "@/features/orders/constants";
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

  const { customer, lines } = parsed.data;

  try {
    const [pricedLines, deliveryFee] = await Promise.all([priceCheckoutLines(lines), getDeliveryFee()]);
    const subtotal = pricedLines.reduce((sum, line) => sum + line.lineTotal, 0);
    const total = subtotal + deliveryFee;
    const orderId = randomUUID();
    const orderNumber = generateOrderNumber();

    await db.batch([
      db.insert(orders).values({
        id: orderId,
        orderNumber,
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        customerCommune: customer.commune,
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
          lineTotal: String(line.lineTotal),
        }))
      ),
    ]);

    revalidateTag(ORDERS_CACHE_TAG, "max");
    return { ok: true, order: { customer, orderNumber, lines: pricedLines, subtotal, deliveryFee, total } };
  } catch (error) {
    if (error instanceof PricingError) return { ok: false, error: error.message };
    console.error("placeOrder failed", error);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }
}
