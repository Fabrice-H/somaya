import type { DashboardStats, KpiColor } from "./types";

export const RECENT_ORDERS_LIMIT = 5;

export const KPI_COLOR_CLASSES: Record<KpiColor, string> = {
  burgundy: "bg-[#511f29]/10 text-[#3c161e]",
  peach: "bg-[#f1e1e5]/30 text-[#c27a4a]",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
  recentOrders: [],
};
