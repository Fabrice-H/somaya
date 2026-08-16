"use server";

import { db, orders, orderItems } from "@/lib/db";
import { eq, desc, sql, and, or, gte, lte, ilike } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";
import type {
  Order as DbOrder,
  OrderItem as DbOrderItem,
} from "@/lib/db/schema";

// ============================================================
// TYPES
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  color: string | null;
  size: string | null;
  lot_id: string | null;
  lot_name: string | null;
  line_total: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_first_name: string;
  customer_last_name: string;
  customer_name: string; // Combined name for display
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  customer_commune: string | null;
  customer_notes: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_zone_id: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items_count?: number;
  order_items?: OrderItem[];
}

export interface OrdersStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface OrdersFilterParams {
  status?: OrderStatus | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// HELPERS
// ============================================================

function toAdminOrderItem(item: DbOrderItem): OrderItem {
  return {
    id: item.id,
    order_id: item.orderId,
    product_id: item.productId,
    product_name: item.productName,
    product_price: Number(item.productPrice),
    product_image: item.productImage,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
    lot_id: item.lotId,
    lot_name: item.lotName,
    line_total: Number(item.lineTotal),
    created_at: item.createdAt.toISOString(),
  };
}

function toAdminOrder(order: DbOrder, items?: DbOrderItem[]): Order {
  return {
    id: order.id,
    order_number: order.orderNumber,
    status: order.status as OrderStatus,
    customer_first_name: order.customerFirstName,
    customer_last_name: order.customerLastName,
    customer_name: `${order.customerFirstName} ${order.customerLastName}`,
    customer_phone: order.customerPhone,
    customer_email: order.customerEmail,
    customer_address: order.customerAddress,
    customer_commune: order.customerCommune,
    customer_notes: order.customerNotes,
    payment_method: order.paymentMethod as PaymentMethod,
    payment_status: order.paymentStatus as PaymentStatus,
    subtotal: Number(order.subtotal),
    delivery_fee: Number(order.deliveryFee),
    total: Number(order.total),
    delivery_zone_id: order.deliveryZoneId,
    delivered_at: order.deliveredAt?.toISOString() || null,
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    items_count: items?.length,
    order_items: items?.map(toAdminOrderItem),
  };
}

// ============================================================
// ACTIONS
// ============================================================

/**
 * Get orders with filtering and pagination
 */
export async function getOrders(
  params: OrdersFilterParams = {}
): Promise<PaginatedOrders> {
  const admin = await requireAdmin();
  if (!admin) {
    return { orders: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }

  const {
    status = "all",
    search = "",
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
  } = params;

  try {
    // Build where conditions
    const conditions = [];

    // Status filter
    if (status && status !== "all") {
      conditions.push(eq(orders.status, status));
    }

    // Search filter (order number, name, phone)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(orders.orderNumber, searchTerm),
          ilike(orders.customerFirstName, searchTerm),
          ilike(orders.customerLastName, searchTerm),
          ilike(orders.customerPhone, searchTerm)
        )
      );
    }

    // Date filters
    if (dateFrom) {
      conditions.push(gte(orders.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
      // Add 1 day to include the end date
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      conditions.push(lte(orders.createdAt, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Get orders with items
    const result = await db.query.orders.findMany({
      where: whereClause,
      with: {
        items: true,
      },
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
    });

    return {
      orders: result.map((o) => toAdminOrder(o, o.items)),
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

/**
 * Get orders statistics by status
 */
export async function getOrdersStats(): Promise<OrdersStats> {
  const admin = await requireAdmin();
  if (!admin) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
  }

  try {
    const stats = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    const result: OrdersStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    stats.forEach((stat) => {
      const count = Number(stat.count);
      result.total += count;
      if (stat.status in result) {
        result[stat.status as keyof Omit<OrdersStats, "total">] = count;
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching orders stats:", error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
  }
}

/**
 * Get single order by ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    const result = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: true,
      },
    });

    if (!result) return null;
    return toAdminOrder(result, result.items);
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    await db.update(orders).set(updateData).where(eq(orders.id, id));

    revalidatePath("/admin/commandes");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Update payment status
 */
export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(orders)
      .set({
        paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id));

    revalidatePath("/admin/commandes");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

// ============================================================
// PUBLIC ACTIONS (for checkout)
// ============================================================

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SM-${year}${month}${day}-${random}`;
}

export async function createOrder(data: {
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  customer_commune: string;
  customer_notes?: string;
  payment_method: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: Array<{
    product_id?: string | null;
    product_name: string;
    product_price: number;
    product_image?: string | null;
    quantity: number;
    color?: string | null;
    size?: string | null;
    lot_id?: string | null;
    lot_name?: string | null;
    line_total: number;
  }>;
}): Promise<{ success: boolean; order_number?: string; error?: string }> {
  try {
    const orderNumber = generateOrderNumber();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerFirstName: data.customer_first_name,
        customerLastName: data.customer_last_name,
        customerPhone: data.customer_phone,
        customerEmail: data.customer_email || null,
        customerAddress: data.customer_address || "",
        customerCommune: data.customer_commune,
        customerNotes: data.customer_notes || null,
        paymentMethod: data.payment_method,
        subtotal: String(data.subtotal),
        deliveryFee: String(data.delivery_fee),
        total: String(data.total),
        status: "pending",
        paymentStatus: "pending",
      })
      .returning({ id: orders.id, orderNumber: orders.orderNumber });

    if (!order) {
      return { success: false, error: "Erreur lors de la création" };
    }

    const itemsToInsert = data.items.map((item) => ({
      orderId: order.id,
      productId: item.product_id || null,
      productName: item.product_name,
      productPrice: String(item.product_price),
      productImage: item.product_image || null,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      lotId: item.lot_id || null,
      lotName: item.lot_name || null,
      lineTotal: String(item.line_total),
    }));

    await db.insert(orderItems).values(itemsToInsert);

    return { success: true, order_number: order.orderNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}
