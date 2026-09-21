import "server-only";
import { count, desc, eq, sql } from "drizzle-orm";
import { db, orders, products } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { EMPTY_DASHBOARD_STATS, RECENT_ORDERS_LIMIT } from "../constants";
import type { DashboardStats } from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
  await assertAdmin();

  try {
    const [[orderTotals], [productTotals], recent] = await Promise.all([
      db
        .select({
          totalOrders: count(),
          pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')`.mapWith(Number),
          totalRevenue:
            sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'delivered'), 0)`.mapWith(
              Number
            ),
        })
        .from(orders),
      db.select({ totalProducts: count() }).from(products).where(eq(products.isActive, true)),
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

    return {
      ...orderTotals,
      ...productTotals,
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
