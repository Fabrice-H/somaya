import { Clock, Package, ShoppingBag, Wallet } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import { formatPrice } from "@/shared/lib/format";
import type { DashboardStats } from "../types";

export function DashboardKpis({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Commandes" value={stats.totalOrders} hint="Depuis l'ouverture" icon={ShoppingBag} />
      <StatCard label="À traiter" value={stats.pendingOrders} hint="Commandes en attente" icon={Clock} tone="primary" />
      <StatCard
        label="Chiffre d'affaires"
        value={formatPrice(stats.totalRevenue)}
        hint="Commandes livrées"
        icon={Wallet}
      />
      <StatCard label="Produits en ligne" value={stats.totalProducts} hint="Visibles en boutique" icon={Package} />
    </div>
  );
}
