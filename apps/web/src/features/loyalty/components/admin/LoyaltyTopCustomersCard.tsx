import Link from "next/link";
import { Crown } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { Table, Td, Th, Tr } from "@/shared/components/admin/ui/Table";
import { formatPhone } from "@/shared/lib/phone";
import { CUSTOMERS_PATH } from "@/features/customers/constants";
import { LOYALTY_LEVEL_BADGES } from "../../constants";
import type { LoyaltyTopCustomer } from "../../types";

export function LoyaltyTopCustomersCard({ customers }: { customers: LoyaltyTopCustomer[] }) {
  return (
    <AdminCard title="Clients les plus fidèles" padded={false}>
      {customers.length === 0 ? (
        <EmptyState
          icon={Crown}
          title="Aucun point attribué"
          description="Les clients apparaîtront ici dès leur première commande livrée."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Client</Th>
              <Th>Niveau</Th>
              <Th align="right">Commandes</Th>
              <Th align="right">Points</Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <Tr key={customer.id}>
                <Td>
                  <Link
                    href={`${CUSTOMERS_PATH}/${customer.id}`}
                    className="font-medium hover:text-[var(--som-primary)]"
                  >
                    {customer.full_name}
                  </Link>
                  <p className="m-0 mt-0.5 text-[12px] font-light tabular-nums text-[var(--som-gray)]">
                    {formatPhone(customer.phone)}
                  </p>
                </Td>
                <Td>
                  <Badge tone={LOYALTY_LEVEL_BADGES[customer.loyalty_level].tone}>
                    {LOYALTY_LEVEL_BADGES[customer.loyalty_level].label}
                  </Badge>
                </Td>
                <Td align="right">
                  <span className="tabular-nums">{customer.orders_count}</span>
                </Td>
                <Td align="right">
                  <span className="font-medium tabular-nums">{customer.loyalty_points}</span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </AdminCard>
  );
}
