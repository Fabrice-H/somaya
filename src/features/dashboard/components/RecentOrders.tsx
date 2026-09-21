import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { StatusBadge } from "@/shared/components/admin/StatusBadge";
import { formatPrice } from "@/shared/lib/format";
import type { RecentOrder } from "../types";

function RecentOrdersEmpty() {
  return (
    <div className="p-8 text-center text-[#3c161e]/50">
      <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
      <p>Aucune commande pour le moment</p>
      <p className="text-sm mt-1">Les commandes apparaitront ici</p>
    </div>
  );
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-[#511f29]/10 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#3c161e]">Commandes recentes</h2>
        <Link href="/admin/commandes" className="text-sm text-[#3c161e]/60 hover:text-[#3c161e]">
          Voir tout
        </Link>
      </div>
      {orders.length === 0 ? (
        <RecentOrdersEmpty />
      ) : (
        <div className="divide-y divide-[#511f29]/10">
          {orders.map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#fafafa]/50">
              <div>
                <p className="font-medium text-[#3c161e]">{order.order_number}</p>
                <p className="text-sm text-[#3c161e]/60">{order.customer_name}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="text-sm font-medium text-[#3c161e]">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
