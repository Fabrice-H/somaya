import "server-only";
import { and, count, desc, eq, gte, isNotNull, or, sql, type SQL } from "drizzle-orm";
import { db, orderItems, orders } from "@/shared/lib/db";
import type { Customer } from "@/shared/lib/db/schema";
import { getCustomerLoyaltyHistory } from "@/features/loyalty/server/queries";
import { getPublicLoyaltySettings } from "@/features/loyalty/server/settings";
import { nextLevel, orderedLevels } from "@/features/loyalty/rules";
import { ACCOUNT_ORDERS_LIMIT } from "../constants";
import { orderIdSchema } from "../schemas";
import type { AccountOrderDetail, AccountOrderSummary, AccountOverview } from "../types";
import { toAccountCustomer, toAccountOrderDetail, toAccountOrderSummary } from "./mappers";

export function visibleOrdersWhere(customer: Customer): SQL {
  const since = customer.accountCreatedAt ?? new Date(0);
  return and(eq(orders.customerId, customer.id), or(isNotNull(orders.claimedAt), gte(orders.createdAt, since)))!;
}

export async function getAccountOrders(customer: Customer): Promise<AccountOrderSummary[]> {
  const rows = await db
    .select({ order: orders, itemsCount: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number) })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(visibleOrdersWhere(customer))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt))
    .limit(ACCOUNT_ORDERS_LIMIT);
  return rows.map((row) => toAccountOrderSummary(row.order, row.itemsCount));
}

export async function getHiddenOrdersCount(customer: Customer): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(orders)
    .where(and(eq(orders.customerId, customer.id), sql`not (${visibleOrdersWhere(customer)})`));
  return row?.total ?? 0;
}

export async function getAccountOrder(customer: Customer, id: string): Promise<AccountOrderDetail | null> {
  if (!orderIdSchema.safeParse(id).success) return null;
  const row = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), visibleOrdersWhere(customer)),
    with: { items: true },
  });
  return row ? toAccountOrderDetail(row) : null;
}

export async function getAccountOverview(customer: Customer): Promise<AccountOverview> {
  const [orderRows, hiddenOrdersCount, settings, history] = await Promise.all([
    getAccountOrders(customer),
    getHiddenOrdersCount(customer),
    getPublicLoyaltySettings(),
    getCustomerLoyaltyHistory(customer.id),
  ]);
  const levels = orderedLevels(settings.levels);
  return {
    customer: toAccountCustomer(customer),
    orders: orderRows,
    hiddenOrdersCount,
    loyalty: { levels, nextLevel: nextLevel(customer.loyaltyPoints, levels), history },
  };
}
