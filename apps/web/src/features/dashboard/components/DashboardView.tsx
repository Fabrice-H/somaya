import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import type { DashboardStats } from "../types";
import { ChannelSplit } from "./ChannelSplit";
import { DashboardKpis } from "./DashboardKpis";
import { QuickActions } from "./QuickActions";
import { RecentOrders } from "./RecentOrders";
import { RevenueChart } from "./RevenueChart";

export function DashboardView({ stats }: { stats: DashboardStats }) {
  return (
    <AdminPage
      eyebrow="Vue d'ensemble"
      title="Tableau de bord"
      description="L'essentiel de votre boutique en un coup d'œil."
    >
      <DashboardKpis stats={stats} />
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <RevenueChart daily={stats.daily} />
          <RecentOrders orders={stats.recentOrders} />
        </div>
        <div className="space-y-6">
          <ChannelSplit channels={stats.channels} />
          <QuickActions />
        </div>
      </div>
    </AdminPage>
  );
}
