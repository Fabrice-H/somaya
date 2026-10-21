import type { OrderStatus } from "@/features/orders/types";

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: OrderStatus;
}

export interface DailyPoint {
  day: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  awaitingPayment: number;
  totalRevenue: number;
  periodRevenue: number;
  periodOrders: number;
  totalProducts: number;
  customers: { total: number; new: number; active: number; inactive: number; vip: number };
  loyaltyPoints: number;
  payments: { paid: number; pending: number; paidAmount: number };
  channels: { whatsapp: number; online: number };
  daily: DailyPoint[];
  recentOrders: RecentOrder[];
}
