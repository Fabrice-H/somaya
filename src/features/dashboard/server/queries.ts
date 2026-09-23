import "server-only";
import { and, count, desc, eq, gte, ne, sql } from "drizzle-orm";
import { db, loyaltyTransactions, orders, payments, products } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { getCustomersStats } from "@/features/customers/server/queries";
import { awaitingPaymentCondition } from "@/features/orders/server/queries";
import { DASHBOARD_CHART_DAYS, DASHBOARD_PERIOD_DAYS, EMPTY_DASHBOARD_STATS, RECENT_ORDERS_LIMIT } from "../constants";
import type { DashboardStats, DailyPoint } from "../types";

const DAY_MS = 86_400_000;

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await assertAdmin();
  const now = new Date();
  const periodStart = new Date(now.getTime() - DASHBOARD_PERIOD_DAYS * DAY_MS);
  const chartStart = new Date(dayKey(new Date(now.getTime() - (DASHBOARD_CHART_DAYS - 1) * DAY_MS)));
  const notCancelled = ne(orders.status, "cancelled");

  try {
    const [
      [orderTotals],
      [productTotals],
      [awaiting],
      customerStats,
      [loyalty],
      [paymentTotals],
      channelRows,
      dailyRows,
      recent,
    ] = await Promise.all([
      db
        .select({
          totalOrders: count(),
          pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')`.mapWith(Number),
          totalRevenue:
            sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'delivered'), 0)`.mapWith(
              Number
            ),
          periodRevenue:
            sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'delivered' and ${orders.createdAt} >= ${periodStart}), 0)`.mapWith(
              Number
            ),
          periodOrders:
            sql<number>`count(*) filter (where ${orders.createdAt} >= ${periodStart} and ${orders.status} <> 'cancelled')`.mapWith(
              Number
            ),
        })
        .from(orders),
      db.select({ totalProducts: count() }).from(products).where(eq(products.isActive, true)),
      db
        .select({
          total: count(),
          pending: sql<number>`count(*) filter (where ${orders.status} = 'pending')`.mapWith(Number),
        })
        .from(orders)
        .where(awaitingPaymentCondition()),
      getCustomersStats(),
      db
        .select({
          points:
            sql<number>`coalesce(sum(${loyaltyTransactions.points}) filter (where ${loyaltyTransactions.type} = 'earn'), 0)`.mapWith(
              Number
            ),
        })
        .from(loyaltyTransactions),
      db
        .select({
          paid: sql<number>`count(*) filter (where ${payments.status} = 'paid')`.mapWith(Number),
          pending: sql<number>`count(*) filter (where ${payments.status} in ('pending', 'processing'))`.mapWith(Number),
          paidAmount:
            sql<number>`coalesce(sum(${payments.amount}) filter (where ${payments.status} = 'paid'), 0)`.mapWith(
              Number
            ),
        })
        .from(payments),
      db
        .select({ channel: orders.orderChannel, total: count() })
        .from(orders)
        .where(and(notCancelled, gte(orders.createdAt, periodStart)))
        .groupBy(orders.orderChannel),
      db
        .select({
          day: sql<string>`to_char(${orders.createdAt} at time zone 'UTC', 'YYYY-MM-DD')`,
          revenue: sql<number>`coalesce(sum(${orders.total}), 0)`.mapWith(Number),
          orders: count(),
        })
        .from(orders)
        .where(and(notCancelled, gte(orders.createdAt, chartStart)))
        .groupBy(sql`1`),
      db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          firstName: orders.customerFirstName,
          lastName: orders.customerLastName,
          total: orders.total,
          status: orders.status,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(RECENT_ORDERS_LIMIT),
    ]);

    const byDay = new Map(dailyRows.map((row) => [row.day, row]));
    const daily: DailyPoint[] = Array.from({ length: DASHBOARD_CHART_DAYS }, (_, index) => {
      const day = dayKey(new Date(chartStart.getTime() + index * DAY_MS));
      const row = byDay.get(day);
      return { day, revenue: row?.revenue ?? 0, orders: row?.orders ?? 0 };
    });

    return {
      totalOrders: orderTotals.totalOrders,
      pendingOrders: Math.max(0, orderTotals.pendingOrders - (awaiting?.pending ?? 0)),
      awaitingPayment: awaiting?.total ?? 0,
      totalRevenue: orderTotals.totalRevenue,
      periodRevenue: orderTotals.periodRevenue,
      periodOrders: orderTotals.periodOrders,
      totalProducts: productTotals.totalProducts,
      customers: {
        total: customerStats.total,
        new: customerStats.new,
        active: customerStats.active + customerStats.new + customerStats.loyal + customerStats.vip,
        inactive: customerStats.inactive,
        vip: customerStats.vip,
      },
      loyaltyPoints: loyalty?.points ?? 0,
      payments: {
        paid: paymentTotals?.paid ?? 0,
        pending: paymentTotals?.pending ?? 0,
        paidAmount: paymentTotals?.paidAmount ?? 0,
      },
      channels: {
        whatsapp: channelRows.find((row) => row.channel === "whatsapp")?.total ?? 0,
        online: channelRows.find((row) => row.channel === "online")?.total ?? 0,
      },
      daily,
      recentOrders: recent.map((order) => ({
        id: order.id,
        order_number: order.orderNumber,
        customer_name: `${order.firstName} ${order.lastName}`,
        total: Number(order.total),
        status: order.status,
      })),
    };
  } catch (error) {
    console.error("getDashboardStats failed", error);
    return EMPTY_DASHBOARD_STATS;
  }
}
