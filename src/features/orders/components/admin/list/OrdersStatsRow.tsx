import { CheckCircle2, Clock, ShoppingBag, Truck } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import type { OrdersStats } from "../../../types";

export function OrdersStatsRow({ stats }: { stats: OrdersStats }) {
  const inProgress = stats.confirmed + stats.preparing + stats.shipped;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Commandes" value={stats.total} hint="Toutes périodes" icon={ShoppingBag} />
      <StatCard label="À traiter" value={stats.pending} hint="En attente de confirmation" icon={Clock} tone="primary" />
      <StatCard label="En cours" value={inProgress} hint="Confirmées, en préparation, expédiées" icon={Truck} />
      <StatCard
        label="Livrées"
        value={stats.delivered}
        hint={`${stats.cancelled} annulée${stats.cancelled > 1 ? "s" : ""}`}
        icon={CheckCircle2}
      />
    </div>
  );
}
