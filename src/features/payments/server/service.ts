import "server-only";
import { and, desc, eq, inArray, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db, orders, payments, paymentWebhookEvents } from "@/shared/lib/db";
import type { Payment } from "@/shared/lib/db/schema";
import { emitEvent } from "@/features/events/server/events";
import { ORDERS_CACHE_TAG } from "@/features/orders/constants";
import { PAYMENT_RETURN_PATH } from "../constants";
import { amountsMatch, canTransition } from "../transitions";
import type {
  OnlineOperator,
  ParsedWebhook,
  PaymentProvider,
  ProviderPaymentState,
  StartPaymentResult,
} from "../types";
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

export async function startPayment(orderId: string, operator: OnlineOperator): Promise<StartPaymentResult> {
  const provider = getPaymentProvider();
  if (!provider) return { ok: false, error: "Le paiement en ligne n'est pas disponible pour le moment." };

  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) return { ok: false, error: "Commande introuvable" };
  if (order.paymentStatus === "paid") return { ok: false, error: "Cette commande est déjà payée." };

  const existing = await db.query.payments.findFirst({
    where: and(eq(payments.orderId, order.id), inArray(payments.status, [...REUSABLE_STATUSES])),
    orderBy: [desc(payments.createdAt)],
  });
  if (existing?.checkoutUrl && existing.provider === provider.id && existing.paymentMethod === operator) {
    return { ok: true, checkoutUrl: existing.checkoutUrl };
  }

  const previous = await db.query.payments.findMany({ where: eq(payments.orderId, order.id) });
  const reference = previous.length === 0 ? order.orderNumber : `${order.orderNumber}-${previous.length + 1}`;
  const amount = Number(order.total);
  const now = new Date();

  await db
    .update(payments)
    .set({ status: "cancelled", failureReason: "Remplacée par une nouvelle tentative", updatedAt: now })
    .where(and(eq(payments.orderId, order.id), inArray(payments.status, [...REUSABLE_STATUSES])));

  const [attempt] = await db
    .insert(payments)
    .values({
      orderId: order.id,
      provider: provider.id,
      reference,
      amount: String(amount),
      status: "pending",
      paymentMethod: operator,
    })
    .returning({ id: payments.id });

  try {
    const created = await provider.createPayment({
      reference,
      paymentMethod: operator,
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
    await db
      .update(payments)
      .set({
        providerReference: created.providerReference,
        checkoutUrl: created.checkoutUrl,
        raw: created.raw,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, attempt.id));
    await db
      .update(orders)
      .set({ paymentMethod: "online", orderChannel: "online", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return { ok: true, checkoutUrl: created.checkoutUrl };
  } catch (error) {
    console.error("startPayment failed", error);
    await db
      .update(payments)
      .set({ status: "failed", failureReason: "Création du paiement impossible", updatedAt: new Date() })
      .where(eq(payments.id, attempt.id));
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
      .set({
        paymentStatus: "paid",
        paymentMethod: "online",
        orderChannel: "online",
        paidAt: now,
        updatedAt: now,
        status: sql`case when ${orders.status} = 'cancelled' then 'pending' else ${orders.status} end`,
      })
      .where(
        and(
          eq(orders.id, payment.orderId),
          inArray(orders.paymentStatus, ["pending", "processing", "failed", "cancelled"])
        )
      )
      .returning({ id: orders.id, customerId: orders.customerId });
    if (order) {
      await emitEvent({ type: "order.paid", orderId: order.id, customerId: order.customerId });
    } else {
      const alreadyPaid = await db.query.orders.findFirst({
        where: and(eq(orders.id, payment.orderId), eq(orders.paymentStatus, "paid")),
        columns: { id: true, customerId: true },
      });
      if (alreadyPaid) {
        await db
          .update(payments)
          .set({ failureReason: "Paiement en double : remboursement à effectuer", updatedAt: now })
          .where(eq(payments.id, payment.id));
        console.error("duplicate payment detected", { orderId: payment.orderId, paymentId: payment.id });
        await emitEvent({
          type: "payment.duplicate",
          orderId: alreadyPaid.id,
          customerId: alreadyPaid.customerId,
          paymentId: payment.id,
        });
      }
    }
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

const STALE_PENDING_MS = 2 * 60 * 1000;
const ABANDONED_ATTEMPT_MS = 60 * 60 * 1000;
export const PAYMENT_EXPIRY_MS = 24 * 60 * 60 * 1000;

export type ReconcileReport = {
  paymentsChecked: number;
  paymentsUpdated: number;
  attemptsAbandoned: number;
  ordersExpired: number;
  stockApplied: number;
  loyaltyCredited: number;
};

export async function reconcilePayments(): Promise<
  Pick<ReconcileReport, "paymentsChecked" | "paymentsUpdated" | "attemptsAbandoned" | "ordersExpired">
> {
  const now = Date.now();
  const abandoned = await db
    .update(payments)
    .set({ status: "cancelled", failureReason: "Tentative abandonnée", updatedAt: new Date() })
    .where(
      and(
        inArray(payments.status, [...REUSABLE_STATUSES]),
        isNull(payments.providerReference),
        lt(payments.createdAt, new Date(now - ABANDONED_ATTEMPT_MS))
      )
    )
    .returning({ id: payments.id });

  const pending = await db.query.payments.findMany({
    where: and(
      inArray(payments.status, [...REUSABLE_STATUSES]),
      isNotNull(payments.providerReference),
      lt(payments.createdAt, new Date(now - STALE_PENDING_MS))
    ),
    limit: 100,
  });

  let updated = 0;
  for (const payment of pending) {
    const provider = getPaymentProvider(payment.provider);
    if (!provider || !payment.providerReference) continue;
    try {
      const state = await provider.verifyPayment(payment.providerReference);
      const after = await applyProviderState(payment, state);
      if (after.status !== payment.status) updated += 1;
    } catch (error) {
      console.error("reconcile verify failed", { paymentId: payment.id, error });
    }
  }
  const ordersExpired = await expireUnpaidOrders(now);
  return {
    paymentsChecked: pending.length,
    paymentsUpdated: updated,
    attemptsAbandoned: abandoned.length,
    ordersExpired,
  };
}

async function expireUnpaidOrders(now: number): Promise<number> {
  const stale = await db.query.orders.findMany({
    where: and(
      eq(orders.paymentMethod, "online"),
      eq(orders.status, "pending"),
      inArray(orders.paymentStatus, ["pending", "processing", "failed", "cancelled"]),
      lt(orders.createdAt, new Date(now - PAYMENT_EXPIRY_MS))
    ),
    columns: { id: true, orderNumber: true, customerId: true },
    limit: 100,
  });

  let expired = 0;
  for (const order of stale) {
    const latest = await syncPaymentByReference(order.orderNumber);
    if (latest?.status === "paid") continue;
    const stamp = new Date();
    const [updated] = await db
      .update(orders)
      .set({ status: "cancelled", paymentStatus: "cancelled", updatedAt: stamp })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending"), sql`${orders.paymentStatus} <> 'paid'`))
      .returning({ id: orders.id });
    if (!updated) continue;
    await db
      .update(payments)
      .set({ status: "cancelled", failureReason: "Paiement non finalisé sous 24 h", updatedAt: stamp })
      .where(and(eq(payments.orderId, order.id), inArray(payments.status, [...REUSABLE_STATUSES])));
    await emitEvent({
      type: "order.cancelled",
      orderId: order.id,
      customerId: order.customerId,
      previousStatus: "pending",
    });
    expired += 1;
  }
  return expired;
}

export async function resumePayment(orderId: string): Promise<StartPaymentResult> {
  const last = await db.query.payments.findFirst({
    where: eq(payments.orderId, orderId),
    orderBy: [desc(payments.createdAt)],
  });
  const operator = (last?.paymentMethod ?? "wave") as OnlineOperator;
  return startPayment(orderId, operator);
}
