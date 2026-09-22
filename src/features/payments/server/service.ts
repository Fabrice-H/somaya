import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db, orders, payments, paymentWebhookEvents } from "@/shared/lib/db";
import type { Payment } from "@/shared/lib/db/schema";
import { emitEvent } from "@/features/events/server/events";
import { ORDERS_CACHE_TAG } from "@/features/orders/constants";
import { PAYMENT_RETURN_PATH } from "../constants";
import { amountsMatch, canTransition } from "../transitions";
import type { ParsedWebhook, PaymentProvider, ProviderPaymentState, StartPaymentResult } from "../types";
import { getPublicSiteUrl } from "./config";
import { getPaymentProvider } from "./registry";

const REUSABLE_STATUSES = ["pending", "processing"] as const;

function returnUrls(orderNumber: string) {
  const base = getPublicSiteUrl();
  const build = (result: string) => {
    const url = new URL(PAYMENT_RETURN_PATH, base);
    url.searchParams.set("ref", orderNumber);
    url.searchParams.set("r", result);
    return url.toString();
  };
  return { successUrl: build("ok"), errorUrl: build("ko") };
}

export async function startPayment(orderId: string): Promise<StartPaymentResult> {
  const provider = getPaymentProvider();
  if (!provider) return { ok: false, error: "Le paiement en ligne n'est pas disponible pour le moment." };

  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) return { ok: false, error: "Commande introuvable" };
  if (order.paymentStatus === "paid") return { ok: false, error: "Cette commande est déjà payée." };

  const existing = await db.query.payments.findFirst({
    where: and(eq(payments.orderId, order.id), inArray(payments.status, [...REUSABLE_STATUSES])),
    orderBy: [desc(payments.createdAt)],
  });
  if (existing?.checkoutUrl && existing.provider === provider.id)
    return { ok: true, checkoutUrl: existing.checkoutUrl };

  const attempt = await db
    .select({ count: payments.id })
    .from(payments)
    .where(eq(payments.orderId, order.id))
    .then((rows) => rows.length);
  const reference = attempt === 0 ? order.orderNumber : `${order.orderNumber}-${attempt + 1}`;
  const amount = Number(order.total);

  try {
    const created = await provider.createPayment({
      reference,
      amount,
      currency: "XOF",
      description: `Commande ${order.orderNumber} · SO'MAYA`,
      ...returnUrls(order.orderNumber),
      customer: {
        firstName: order.customerFirstName,
        lastName: order.customerLastName,
        phone: order.customerPhone,
        email: order.customerEmail,
      },
    });
    await db.insert(payments).values({
      orderId: order.id,
      provider: provider.id,
      providerReference: created.providerReference,
      reference,
      amount: String(amount),
      status: "pending",
      checkoutUrl: created.checkoutUrl,
      raw: created.raw,
    });
    await db
      .update(orders)
      .set({ paymentMethod: "online", orderChannel: "online", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return { ok: true, checkoutUrl: created.checkoutUrl };
  } catch (error) {
    console.error("startPayment failed", error);
    return {
      ok: false,
      error: "Impossible de démarrer le paiement. Réessayez ou choisissez le paiement à la livraison.",
    };
  }
}

export async function applyProviderState(payment: Payment, state: ProviderPaymentState): Promise<Payment> {
  const expected = Number(payment.amount);
  let next = state.status;
  let failureReason = state.failureReason;
  if (next === "paid" && !amountsMatch(expected, state.amount)) {
    next = "failed";
    failureReason = `Montant inattendu : ${state.amount} au lieu de ${expected}`;
    console.error("payment amount mismatch", { paymentId: payment.id, expected, received: state.amount });
  }
  if (!canTransition(payment.status, next)) return payment;

  const now = new Date();
  const [updated] = await db
    .update(payments)
    .set({
      status: next,
      paymentMethod: state.paymentMethod ?? payment.paymentMethod,
      failureReason,
      raw: state.raw ?? payment.raw,
      paidAt: next === "paid" ? now : payment.paidAt,
      updatedAt: now,
    })
    .where(and(eq(payments.id, payment.id), eq(payments.status, payment.status)))
    .returning();
  if (!updated) return payment;

  if (next === "paid") {
    const [order] = await db
      .update(orders)
      .set({ paymentStatus: "paid", paymentMethod: "online", orderChannel: "online", paidAt: now, updatedAt: now })
      .where(
        and(
          eq(orders.id, payment.orderId),
          inArray(orders.paymentStatus, ["pending", "processing", "failed", "cancelled"])
        )
      )
      .returning({ id: orders.id, customerId: orders.customerId });
    if (order) await emitEvent({ type: "order.paid", orderId: order.id, customerId: order.customerId });
  } else if (next === "failed" || next === "cancelled" || next === "processing") {
    await db
      .update(orders)
      .set({ paymentStatus: next, updatedAt: now })
      .where(
        and(
          eq(orders.id, payment.orderId),
          inArray(orders.paymentStatus, ["pending", "processing", "failed", "cancelled"])
        )
      );
  }
  revalidateTag(ORDERS_CACHE_TAG, "max");
  return updated;
}

export async function syncPaymentByReference(orderNumber: string): Promise<Payment | null> {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.reference, orderNumber),
    orderBy: [desc(payments.createdAt)],
  });
  const latest =
    payment ??
    (await db.query.orders
      .findFirst({ where: eq(orders.orderNumber, orderNumber), columns: { id: true } })
      .then((order) =>
        order
          ? db.query.payments.findFirst({ where: eq(payments.orderId, order.id), orderBy: [desc(payments.createdAt)] })
          : undefined
      ));
  if (!latest) return null;
  if (latest.status === "paid" || latest.status === "refunded" || !latest.providerReference) return latest;

  const provider = getPaymentProvider(latest.provider);
  if (!provider) return latest;
  try {
    const state = await provider.verifyPayment(latest.providerReference);
    return await applyProviderState(latest, state);
  } catch (error) {
    console.error("syncPaymentByReference failed", error);
    return latest;
  }
}

export type WebhookOutcome = "processed" | "duplicate" | "unknown" | "invalid";

export async function handleWebhook(provider: PaymentProvider, webhook: ParsedWebhook): Promise<WebhookOutcome> {
  const inserted = await db
    .insert(paymentWebhookEvents)
    .values({ provider: provider.id, eventId: webhook.eventId, payload: webhook.state.raw })
    .onConflictDoNothing()
    .returning({ id: paymentWebhookEvents.id });
  if (inserted.length === 0) return "duplicate";

  const payment =
    (webhook.providerReference
      ? await db.query.payments.findFirst({ where: eq(payments.providerReference, webhook.providerReference) })
      : undefined) ??
    (webhook.reference
      ? await db.query.payments.findFirst({ where: eq(payments.reference, webhook.reference) })
      : undefined);
  if (!payment || payment.provider !== provider.id) return "unknown";

  await applyProviderState(payment, webhook.state);
  await db
    .update(paymentWebhookEvents)
    .set({ processedAt: new Date() })
    .where(eq(paymentWebhookEvents.id, inserted[0].id));
  return "processed";
}
