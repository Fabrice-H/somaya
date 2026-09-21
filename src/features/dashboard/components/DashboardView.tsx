import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import type { DashboardStats } from "../types";
import { DashboardKpis } from "./DashboardKpis";
import { QuickActions } from "./QuickActions";
import { RecentOrders } from "./RecentOrders";

export function DashboardView({ stats }: { stats: DashboardStats }) {
  return (
    <AdminPage
      eyebrow="Vue d'ensemble"
      title="Tableau de bord"
      description="L'essentiel de votre boutique en un coup d'œil."
    >
      <DashboardKpis stats={stats} />
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        <RecentOrders orders={stats.recentOrders} />
        <QuickActions />
      </div>
    </AdminPage>
  );
}
