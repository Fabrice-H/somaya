import { ShoppingCart, Package, DollarSign, Clock } from "lucide-react";
import { KpiCard, StatusBadge, type OrderStatus } from "@/features/admin/components";
import { getDashboardStats } from "@/features/admin/dashboard/actions";
import { formatPriceXOF as formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#3c161e]">Dashboard</h1>
        <p className="text-[#3c161e]/60 mt-1">Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Commandes totales"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          color="burgundy"
        />
        <KpiCard
          title="En attente"
          value={stats?.pendingOrders || 0}
          subtitle="A traiter"
          icon={Clock}
          color="peach"
        />
        <KpiCard
          title="Chiffre d'affaires"
          value={formatPrice(stats?.totalRevenue || 0)}
          subtitle="Commandes livrees"
          icon={DollarSign}
          color="green"
        />
        <KpiCard
          title="Produits actifs"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="blue"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-[#511f29]/10 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#3c161e]">Commandes recentes</h2>
          <Link
            href="/admin/commandes"
            className="text-sm text-[#3c161e]/60 hover:text-[#3c161e]"
          >
            Voir tout
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-[#511f29]/10">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-[#fafafa]/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-[#3c161e]">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-[#3c161e]/60">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status as OrderStatus} />
                  <span className="text-sm font-medium text-[#3c161e]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[#3c161e]/50">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune commande pour le moment</p>
            <p className="text-sm mt-1">Les commandes apparaitront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
