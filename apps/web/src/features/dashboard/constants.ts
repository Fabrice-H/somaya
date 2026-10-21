import type { DashboardStats } from "./types";

export const RECENT_ORDERS_LIMIT = 5;
export const DASHBOARD_PERIOD_DAYS = 30;
export const DASHBOARD_CHART_DAYS = 14;

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalOrders: 0,
  pendingOrders: 0,
  awaitingPayment: 0,
  totalRevenue: 0,
  periodRevenue: 0,
  periodOrders: 0,
  totalProducts: 0,
  customers: { total: 0, new: 0, active: 0, inactive: 0, vip: 0 },
  loyaltyPoints: 0,
  payments: { paid: 0, pending: 0, paidAmount: 0 },
  channels: { whatsapp: 0, online: 0 },
  daily: [],
  recentOrders: [],
};
