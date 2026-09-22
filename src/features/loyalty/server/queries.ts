import "server-only";
import { count, desc, eq, sql } from "drizzle-orm";
import { customers, db, loyaltyTransactions, orders } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import {
  LOYALTY_HISTORY_LIMIT,
  LOYALTY_LEVELS,
  LOYALTY_RECENT_TRANSACTIONS_LIMIT,
  LOYALTY_TOP_CUSTOMERS_LIMIT,
} from "../constants";
import { levelForPoints } from "../rules";
import type { LoyaltyLevel, LoyaltyOverview, LoyaltyTransactionDto, LoyaltyTransactionType } from "../types";
import { listDeliveredOrdersWithoutPoints } from "./service";
import { getLoyaltySettings } from "./settings";

const toLevel = (value: string): LoyaltyLevel => LOYALTY_LEVELS.find((level) => level === value) ?? "new";
const toType = (value: string): LoyaltyTransactionType => (value === "revoke" || value === "adjust" ? value : "earn");

function transactionSelection() {
  return {
    id: loyaltyTransactions.id,
    type: loyaltyTransactions.type,
    points: loyaltyTransactions.points,
    reason: loyaltyTransactions.reason,
    actorEmail: loyaltyTransactions.actorEmail,
    orderId: loyaltyTransactions.orderId,
    orderNumber: orders.orderNumber,
    createdAt: loyaltyTransactions.createdAt,
  };
}

type TransactionRow = {
  id: string;
  type: string;
  points: number;
  reason: string | null;
  actorEmail: string | null;
  orderId: string | null;
  orderNumber: string | null;
  createdAt: Date;
};

const toDto = (row: TransactionRow): LoyaltyTransactionDto => ({
  id: row.id,
  type: toType(row.type),
  points: row.points,
  reason: row.reason,
  actor_email: row.actorEmail,
  order_id: row.orderId,
  order_number: row.orderNumber,
  created_at: row.createdAt.toISOString(),
});

export async function getCustomerLoyaltyHistory(customerId: string): Promise<LoyaltyTransactionDto[]> {
  const rows = await db
    .select(transactionSelection())
    .from(loyaltyTransactions)
    .leftJoin(orders, eq(loyaltyTransactions.orderId, orders.id))
    .where(eq(loyaltyTransactions.customerId, customerId))
    .orderBy(desc(loyaltyTransactions.createdAt))
    .limit(LOYALTY_HISTORY_LIMIT);
  return rows.map(toDto);
}

export async function getLoyaltyOverview(): Promise<LoyaltyOverview> {
  await assertAdmin();
  const settings = await getLoyaltySettings();

  const [[totals], levelRows, topRows, recentRows, pendingBackfill] = await Promise.all([
    db
      .select({
        members: sql<number>`count(*) filter (where ${customers.loyaltyPoints} > 0)`.mapWith(Number),
        pointsEarned:
          sql<number>`coalesce((select sum(points) from loyalty_transactions where type = 'earn'), 0)`.mapWith(Number),
        pointsRevoked:
          sql<number>`coalesce((select -sum(points) from loyalty_transactions where type = 'revoke'), 0)`.mapWith(
            Number
          ),
        pointsAdjusted:
          sql<number>`coalesce((select sum(points) from loyalty_transactions where type = 'adjust'), 0)`.mapWith(
            Number
          ),
      })
      .from(customers),
    db.select({ level: customers.loyaltyLevel, total: count() }).from(customers).groupBy(customers.loyaltyLevel),
    db
      .select({
        id: customers.id,
        firstName: customers.firstName,
        lastName: customers.lastName,
        phone: customers.phone,
        loyaltyPoints: customers.loyaltyPoints,
        loyaltyLevel: customers.loyaltyLevel,
        ordersCount: customers.ordersCount,
      })
      .from(customers)
      .where(sql`${customers.loyaltyPoints} > 0`)
      .orderBy(desc(customers.loyaltyPoints), desc(customers.ordersCount))
      .limit(LOYALTY_TOP_CUSTOMERS_LIMIT),
    db
      .select({
        ...transactionSelection(),
        customerId: loyaltyTransactions.customerId,
        firstName: customers.firstName,
        lastName: customers.lastName,
      })
      .from(loyaltyTransactions)
      .innerJoin(customers, eq(loyaltyTransactions.customerId, customers.id))
      .leftJoin(orders, eq(loyaltyTransactions.orderId, orders.id))
      .orderBy(desc(loyaltyTransactions.createdAt))
      .limit(LOYALTY_RECENT_TRANSACTIONS_LIMIT),
    listDeliveredOrdersWithoutPoints(),
  ]);

  const levelCounts = Object.fromEntries(LOYALTY_LEVELS.map((level) => [level, 0])) as Record<LoyaltyLevel, number>;
  for (const row of levelRows) levelCounts[toLevel(row.level)] += row.total;

  return {
    settings,
    stats: {
      members: totals?.members ?? 0,
      pointsEarned: totals?.pointsEarned ?? 0,
      pointsRevoked: totals?.pointsRevoked ?? 0,
      pointsAdjusted: totals?.pointsAdjusted ?? 0,
      levelCounts,
      deliveredWithoutPoints: pendingBackfill.length,
    },
    topCustomers: topRows.map((row) => ({
      id: row.id,
      full_name: `${row.firstName} ${row.lastName}`.trim(),
      phone: row.phone,
      loyalty_points: row.loyaltyPoints,
      loyalty_level: levelForPoints(row.loyaltyPoints, settings.levels),
      orders_count: row.ordersCount,
    })),
    recent: recentRows.map((row) => ({
      ...toDto(row),
      customer_id: row.customerId,
      customer_name: `${row.firstName} ${row.lastName}`.trim(),
    })),
  };
}
