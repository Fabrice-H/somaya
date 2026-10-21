import Link from "next/link";
import { History } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { formatDateTime } from "@/shared/lib/format";
import { CUSTOMERS_PATH } from "@/features/customers/constants";
import { ORDERS_PATH } from "@/features/orders/constants";
import type { LoyaltyRecentTransaction } from "../../types";
import { LoyaltyTransactionBadge, PointsDelta } from "./LoyaltyTransactionBadge";

export function LoyaltyTransactionsCard({ transactions }: { transactions: LoyaltyRecentTransaction[] }) {
  return (
    <AdminCard title="Derniers mouvements" padded={false}>
      {transactions.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucun mouvement"
          description="Chaque attribution ou retrait de points apparaîtra ici."
        />
      ) : (
        <ul className="m-0 list-none p-0">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--som-border)] px-5 py-3 last:border-b-0 lg:px-6"
            >
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[14px] text-[var(--som-ink)]">
                  <Link
                    href={`${CUSTOMERS_PATH}/${transaction.customer_id}`}
                    className="font-medium hover:text-[var(--som-primary)]"
                  >
                    {transaction.customer_name}
                  </Link>
                  {transaction.order_id && transaction.order_number && (
                    <>
                      {" · "}
                      <Link
                        href={`${ORDERS_PATH}/${transaction.order_id}`}
                        className="tabular-nums hover:text-[var(--som-primary)]"
                      >
                        {transaction.order_number}
                      </Link>
                    </>
                  )}
                </p>
                <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">
                  {formatDateTime(transaction.created_at)}
                  {transaction.reason && ` · ${transaction.reason}`}
                  {transaction.actor_email && ` · ${transaction.actor_email}`}
                </p>
              </div>
              <LoyaltyTransactionBadge type={transaction.type} />
              <PointsDelta points={transaction.points} />
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
