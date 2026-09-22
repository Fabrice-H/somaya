import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { StatusBadge } from "@/shared/components/admin/StatusBadge";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { Table, Td, Th, Tr } from "@/shared/components/admin/ui/Table";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { ORDERS_PATH } from "@/features/orders/constants";
import type { CustomerOrder } from "../../../types";

export function CustomerOrdersCard({ orders }: { orders: CustomerOrder[] }) {
  return (
    <AdminCard
      title="Historique des commandes"
      description={`${orders.length} commande${orders.length > 1 ? "s" : ""}`}
      padded={false}
    >
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Aucune commande"
          description="Les commandes de ce client apparaîtront ici."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Commande</Th>
              <Th>Date</Th>
              <Th align="right">Articles</Th>
              <Th>Statut</Th>
              <Th align="right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>
                  <Link
                    href={`${ORDERS_PATH}/${order.id}`}
                    className="font-medium tabular-nums hover:text-[var(--som-primary)]"
                  >
                    {order.order_number}
                  </Link>
                </Td>
                <Td muted>{formatDate(order.created_at)}</Td>
                <Td align="right">
                  <span className="tabular-nums">{order.items_count}</span>
                </Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td align="right">
                  <span className="font-medium tabular-nums">{formatPrice(order.total)}</span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </AdminCard>
  );
}
