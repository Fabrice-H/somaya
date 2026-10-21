import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { Table, Td, Th, Tr } from "@/shared/components/admin/ui/Table";
import { StatusBadge } from "@/shared/components/admin/StatusBadge";
import { formatPrice } from "@/shared/lib/format";
import type { RecentOrder } from "../types";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <AdminCard
      title="Commandes récentes"
      padded={false}
      action={
        <Link
          href="/admin/commandes"
          className="inline-flex min-h-9 items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--som-primary)] hover:underline"
        >
          Tout voir
          <ArrowRight size={13} strokeWidth={1.5} aria-hidden />
        </Link>
      }
    >
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Aucune commande pour le moment"
          description="Les nouvelles commandes apparaîtront ici."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Commande</Th>
              <Th>Client</Th>
              <Th>Statut</Th>
              <Th align="right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>
                  <Link href={`/admin/commandes/${order.id}`} className="font-medium hover:text-[var(--som-primary)]">
                    {order.order_number}
                  </Link>
                </Td>
                <Td muted>{order.customer_name}</Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td align="right">
                  <span className="tabular-nums">{formatPrice(order.total)}</span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </AdminCard>
  );
}
