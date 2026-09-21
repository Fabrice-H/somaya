import type { DashboardStats } from "../types";
import { DashboardKpis } from "./DashboardKpis";
import { RecentOrders } from "./RecentOrders";

export function DashboardView({ stats }: { stats: DashboardStats }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#3c161e]">Dashboard</h1>
        <p className="text-[#3c161e]/60 mt-1">Vue d&apos;ensemble de votre boutique</p>
      </div>
      <DashboardKpis stats={stats} />
      <RecentOrders orders={stats.recentOrders} />
    </div>
  );
}
