"use server";

import { db, orders, products } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  total: number;
  status: string;
  created_at: string;
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    // Get total orders count
    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);
    const totalOrders = Number(totalOrdersResult[0]?.count || 0);

    // Get pending orders count
    const pendingOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const pendingOrders = Number(pendingOrdersResult[0]?.count || 0);

    // Get total revenue (delivered orders only)
    const revenueResult = await db
      .select({ total: orders.total })
      .from(orders)
      .where(eq(orders.status, "delivered"));
    const totalRevenue = revenueResult.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    // Get total active products
    const totalProductsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.isActive, true));
    const totalProducts = Number(totalProductsResult[0]?.count || 0);

    // Get recent orders
    const recentOrdersResult = await db
      .select({
        id: orders.id,
        order_number: orders.orderNumber,
        customer_first_name: orders.customerFirstName,
        customer_last_name: orders.customerLastName,
        total: orders.total,
        status: orders.status,
        created_at: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const recentOrders: RecentOrder[] = recentOrdersResult.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      customer_first_name: order.customer_first_name,
      customer_last_name: order.customer_last_name,
      total: Number(order.total),
      status: order.status,
      created_at: order.created_at.toISOString(),
    }));

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      recentOrders: [],
    };
  }
}
