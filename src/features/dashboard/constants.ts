import type { DashboardStats } from "./types";

export const RECENT_ORDERS_LIMIT = 5;

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
  recentOrders: [],
};
