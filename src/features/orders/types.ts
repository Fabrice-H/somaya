import type { Order as DbOrder } from "@/shared/lib/db/schema";

export type OrderStatus = DbOrder["status"];
export type PaymentMethod = DbOrder["paymentMethod"];
export type PaymentStatus = DbOrder["paymentStatus"];
export type OrderStatusFilter = OrderStatus | "all";

export interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  lot_name: string | null;
  line_total: number;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  payment_method: PaymentMethod;
  total: number;
  created_at: string;
}

export interface OrderDetail extends OrderSummary {
  customer_first_name: string;
  customer_email: string | null;
  customer_address: string | null;
  customer_commune: string | null;
  customer_notes: string | null;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  delivered_at: string | null;
  updated_at: string;
  items: OrderItem[];
}

export type OrderNotificationData = Pick<
  OrderDetail,
  "status" | "order_number" | "customer_first_name" | "customer_phone" | "total"
>;

export type OrdersStats = Record<OrderStatus | "total", number>;

export interface OrdersFilter {
  status: OrderStatusFilter;
  search: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
}

export interface PaginatedOrders {
  orders: OrderSummary[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StatusColors {
  bg: string;
  text: string;
}

export type OrderActionResult = { ok: true } | { ok: false; error: string };
