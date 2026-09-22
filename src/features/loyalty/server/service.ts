import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { customers, db, loyaltyTransactions, orders } from "@/shared/lib/db";
import { LOYALTY_REASONS } from "../constants";
import { computeEarnedPoints, levelForPoints } from "../rules";
import { getLoyaltySettings } from "./settings";

export type CreditResult = { credited: boolean; points: number; customerId: string | null };

export async function recomputeCustomerLoyalty(customerId: string): Promise<{ points: number }> {
  const settings = await getLoyaltySettings();
  const [row] = await db
    .select({ points: sql<number>`coalesce(sum(${loyaltyTransactions.points}), 0)`.mapWith(Number) })
    .from(loyaltyTransactions)
    .where(eq(loyaltyTransactions.customerId, customerId));
  const points = Math.max(0, row?.points ?? 0);
  await db
    .update(customers)
    .set({ loyaltyPoints: points, loyaltyLevel: levelForPoints(points, settings.levels), updatedAt: new Date() })
    .where(eq(customers.id, customerId));
  return { points };
}

export async function recomputeAllLoyaltyLevels(): Promise<number> {
  const rows = await db.select({ id: customers.id }).from(customers);
  for (const row of rows) await recomputeCustomerLoyalty(row.id);
  return rows.length;
}

export async function creditDeliveredOrder(
  orderId: string,
  reason: string = LOYALTY_REASONS.earn
): Promise<CreditResult> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    columns: { id: true, customerId: true, subtotal: true, status: true },
  });
  if (!order?.customerId || order.status !== "delivered") return { credited: false, points: 0, customerId: null };

  const existing = await db.query.loyaltyTransactions.findMany({
    where: eq(loyaltyTransactions.orderId, order.id),
    columns: { id: true, type: true, points: true },
  });
  const earn = existing.find((row) => row.type === "earn");
  const revoke = existing.find((row) => row.type === "revoke");

  if (earn) {
    if (!revoke) return { credited: false, points: earn.points, customerId: order.customerId };
    await db.delete(loyaltyTransactions).where(eq(loyaltyTransactions.id, revoke.id));
    await recomputeCustomerLoyalty(order.customerId);
    return { credited: true, points: earn.points, customerId: order.customerId };
  }

  const settings = await getLoyaltySettings();
  if (!settings.isEnabled) return { credited: false, points: 0, customerId: order.customerId };
  const points = computeEarnedPoints(Number(order.subtotal), settings);
  if (points <= 0) return { credited: false, points: 0, customerId: order.customerId };

  const inserted = await db
    .insert(loyaltyTransactions)
    .values({ customerId: order.customerId, orderId: order.id, type: "earn", points, reason })
    .onConflictDoNothing()
    .returning({ id: loyaltyTransactions.id });
  if (inserted.length === 0) return { credited: false, points, customerId: order.customerId };

  await recomputeCustomerLoyalty(order.customerId);
  return { credited: true, points, customerId: order.customerId };
}

export async function revokeOrderPoints(orderId: string): Promise<{ revoked: boolean; points: number }> {
  const earn = await db.query.loyaltyTransactions.findFirst({
    where: and(eq(loyaltyTransactions.orderId, orderId), eq(loyaltyTransactions.type, "earn")),
  });
  if (!earn) return { revoked: false, points: 0 };

  const inserted = await db
    .insert(loyaltyTransactions)
    .values({
      customerId: earn.customerId,
      orderId,
      type: "revoke",
      points: -earn.points,
      reason: LOYALTY_REASONS.revoke,
    })
    .onConflictDoNothing()
    .returning({ id: loyaltyTransactions.id });
  if (inserted.length === 0) return { revoked: false, points: earn.points };

  await recomputeCustomerLoyalty(earn.customerId);
  return { revoked: true, points: earn.points };
}

export async function adjustCustomerLoyalty(input: {
  customerId: string;
  points: number;
  reason: string;
  actorEmail: string;
}): Promise<{ points: number }> {
  await db.insert(loyaltyTransactions).values({
    customerId: input.customerId,
    type: "adjust",
    points: input.points,
    reason: input.reason,
    actorEmail: input.actorEmail,
  });
  return recomputeCustomerLoyalty(input.customerId);
}

export async function listDeliveredOrdersWithoutPoints(): Promise<string[]> {
  const rows = await db.execute<{ id: string }>(sql`
    select o.id from orders o
    where o.status = 'delivered' and o.customer_id is not null
      and not exists (select 1 from loyalty_transactions t where t.order_id = o.id and t.type = 'earn')
    order by o.delivered_at nulls last, o.created_at
  `);
  return rows.rows.map((row) => row.id);
}
