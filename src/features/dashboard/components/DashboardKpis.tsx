import { Clock, DollarSign, Package, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import type { DashboardStats } from "../types";
import { KpiCard } from "./KpiCard";

export function DashboardKpis({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard title="Commandes totales" value={stats.totalOrders} icon={ShoppingCart} color="burgundy" />
      <KpiCard title="En attente" value={stats.pendingOrders} subtitle="A traiter" icon={Clock} color="peach" />
      <KpiCard
        title="Chiffre d'affaires"
        value={formatPrice(stats.totalRevenue)}
        subtitle="Commandes livrees"
        icon={DollarSign}
        color="green"
      />
      <KpiCard title="Produits actifs" value={stats.totalProducts} icon={Package} color="blue" />
    </div>
  );
}
