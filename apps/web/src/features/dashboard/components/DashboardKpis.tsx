import { Clock, CreditCard, Gift, Package, ShoppingBag, Users, Wallet, MoonStar } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import { formatPrice } from "@/shared/lib/format";
import { DASHBOARD_PERIOD_DAYS } from "../constants";
import type { DashboardStats } from "../types";

export function DashboardKpis({ stats }: { stats: DashboardStats }) {
  const period = `${DASHBOARD_PERIOD_DAYS} derniers jours`;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatPrice(stats.periodRevenue)}
          hint={`${period} · livré · total ${formatPrice(stats.totalRevenue)}`}
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="Commandes"
          value={stats.periodOrders}
          hint={`${period} · ${stats.totalOrders} au total`}
          icon={ShoppingBag}
        />
        <StatCard
          label="À traiter"
          value={stats.pendingOrders}
          hint={
            stats.awaitingPayment > 0
              ? `${stats.awaitingPayment} en attente de paiement`
              : "Commandes reçues à confirmer"
          }
          icon={Clock}
        />
        <StatCard label="Produits en ligne" value={stats.totalProducts} hint="Visibles en boutique" icon={Package} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Clientes"
          value={stats.customers.total}
          hint={`${stats.customers.new} nouvelle${stats.customers.new > 1 ? "s" : ""} · ${stats.customers.vip} VIP`}
          icon={Users}
        />
        <StatCard
          label="Actives / inactives"
          value={`${stats.customers.active} / ${stats.customers.inactive}`}
          hint="Selon les règles de segments"
          icon={MoonStar}
        />
        <StatCard label="Points distribués" value={stats.loyaltyPoints} hint="Programme fidélité" icon={Gift} />
        <StatCard
          label="Paiements en ligne"
          value={stats.payments.paid}
          hint={`${formatPrice(stats.payments.paidAmount)} encaissés · ${stats.payments.pending} en attente`}
          icon={CreditCard}
        />
      </div>
    </div>
  );
}
