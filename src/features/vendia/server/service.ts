import "server-only";
import { and, eq, lte } from "drizzle-orm";
import { customers, db, orderItems, orders, vendiaDeliveries } from "@/shared/lib/db";
import { isOrderEvent, type DomainEvent } from "@/features/events/types";
import { VENDIA_CURRENCY, VENDIA_EVENT_MAP, VENDIA_REQUEST_TIMEOUT_MS, VENDIA_RETRY_BATCH } from "../constants";
import { buildVendiaHeaders, hasAttemptsLeft, isRetryable, retryDelayMs } from "../signature";
import type { DeliveryResult, VendiaPayload, VendiaResponse } from "../types";
import { getVendiaConfig, type VendiaConfig } from "./config";

type DeliveryRow = typeof vendiaDeliveries.$inferSelect;

export type QueueResult =
  { queued: false; reason: string } | { queued: true; deliveryId: string; result: DeliveryResult | null };

const fullName = (first: string, last: string) => `${first} ${last}`.trim();

async function buildPayload(event: DomainEvent): Promise<VendiaPayload | null> {
  const target = VENDIA_EVENT_MAP[event.type];
  if (!target) return null;

  if (isOrderEvent(event)) {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, event.orderId) });
    if (!order) return null;
    const items = await db
      .select({ name: orderItems.productName, quantity: orderItems.quantity, price: orderItems.productPrice })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    return {
      event: target,
      id: `${target}:${order.id}`,
      customer: {
        name: fullName(order.customerFirstName, order.customerLastName),
        phone: order.customerPhone,
        email: order.customerEmail ?? undefined,
      },
      order: {
        id: order.orderNumber,
        total: Number(order.total),
        currency: VENDIA_CURRENCY,
        items: items.map((item) => ({ name: item.name, quantity: item.quantity, price: Number(item.price) })),
      },
      metadata: { orderId: order.id, status: order.status, paymentMethod: order.paymentMethod },
    };
  }

  const customer = await db.query.customers.findFirst({ where: eq(customers.id, event.customerId) });
  if (!customer) return null;
  return {
    event: target,
    id: `${target}:${customer.id}`,
    customer: {
      name: fullName(customer.firstName, customer.lastName),
      phone: customer.phone,
      email: customer.email ?? undefined,
    },
    metadata: { customerId: customer.id, guest: customer.isGuest },
  };
}

async function post(config: VendiaConfig, row: DeliveryRow): Promise<DeliveryResult> {
  const rawBody = JSON.stringify(row.payload);
  let response: Response;
  try {
    response = await fetch(config.url, {
      method: "POST",
      headers: {
        ...buildVendiaHeaders(config.apiKey, config.secret, rawBody),
        "X-Idempotency-Key": row.idempotencyKey,
      },
      body: rawBody,
      signal: AbortSignal.timeout(VENDIA_REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    return {
      status: "retry",
      error: error instanceof Error ? error.message : "Réseau indisponible",
      responseStatus: null,
    };
  }

  const text = await response.text().catch(() => "");
  if (response.ok) {
    let parsed: VendiaResponse = {};
    try {
      parsed = JSON.parse(text) as VendiaResponse;
    } catch {}
    return { status: "sent", outcome: parsed.outcome ?? null, responseStatus: response.status };
  }
  return {
    status: isRetryable(response.status) ? "retry" : "failed",
    error: `HTTP ${response.status} ${text.slice(0, 200)}`.trim(),
    responseStatus: response.status,
  };
}

async function attempt(config: VendiaConfig, row: DeliveryRow): Promise<DeliveryResult> {
  const result = await post(config, row);
  const attempts = row.attempts + 1;
  const now = new Date();
  if (result.status === "sent") {
    await db
      .update(vendiaDeliveries)
      .set({
        status: "sent",
        attempts,
        responseStatus: result.responseStatus,
        outcome: result.outcome?.slice(0, 120) ?? null,
        lastError: null,
        sentAt: now,
        updatedAt: now,
      })
      .where(eq(vendiaDeliveries.id, row.id));
    return result;
  }
  const exhausted = result.status === "failed" || !hasAttemptsLeft(attempts);
  await db
    .update(vendiaDeliveries)
    .set({
      status: exhausted ? "failed" : "pending",
      attempts,
      responseStatus: result.responseStatus,
      lastError: result.error.slice(0, 500),
      nextAttemptAt: new Date(now.getTime() + retryDelayMs(attempts)),
      updatedAt: now,
    })
    .where(eq(vendiaDeliveries.id, row.id));
  return exhausted ? { ...result, status: "failed" } : result;
}

export async function queueVendiaEvent(event: DomainEvent): Promise<QueueResult> {
  const config = getVendiaConfig();
  if (!config) return { queued: false, reason: "Vendia non configuré" };
  const payload = await buildPayload(event);
  if (!payload) return { queued: false, reason: "Événement sans correspondance Vendia" };

  const [inserted] = await db
    .insert(vendiaDeliveries)
    .values({
      idempotencyKey: payload.id,
      event: payload.event,
      aggregateId: isOrderEvent(event) ? event.orderId : event.customerId,
      payload,
    })
    .onConflictDoNothing({ target: vendiaDeliveries.idempotencyKey })
    .returning();
  if (!inserted) return { queued: false, reason: "Déjà envoyé" };

  const result = await attempt(config, inserted);
  return { queued: true, deliveryId: inserted.id, result };
}

export async function retryVendiaDeliveries(
  now = new Date()
): Promise<{ checked: number; sent: number; failed: number }> {
  const config = getVendiaConfig();
  if (!config) return { checked: 0, sent: 0, failed: 0 };
  const due = await db
    .select()
    .from(vendiaDeliveries)
    .where(and(eq(vendiaDeliveries.status, "pending"), lte(vendiaDeliveries.nextAttemptAt, now)))
    .orderBy(vendiaDeliveries.nextAttemptAt)
    .limit(VENDIA_RETRY_BATCH);

  let sent = 0;
  let failed = 0;
  for (const row of due) {
    const result = await attempt(config, row);
    if (result.status === "sent") sent += 1;
    else if (result.status === "failed") failed += 1;
  }
  return { checked: due.length, sent, failed };
}
