"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Table, Td, Th, Tr } from "@/shared/components/admin/ui/Table";
import { formatPrice, formatRelativeDays } from "@/shared/lib/format";
import { formatPhone } from "@/shared/lib/phone";
import { CUSTOMERS_PATH } from "../../../constants";
import type { CustomerSummary } from "../../../types";
import { SegmentBadge } from "../SegmentBadge";

const stop = (event: React.MouseEvent) => event.stopPropagation();

export function CustomersTable({ customers }: { customers: CustomerSummary[] }) {
  const router = useRouter();

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Client</Th>
              <Th>Segment</Th>
              <Th align="right">Commandes</Th>
              <Th align="right">Total dépensé</Th>
              <Th>Dernière commande</Th>
              <Th align="right">Points</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const href = `${CUSTOMERS_PATH}/${customer.id}`;
              return (
                <Tr key={customer.id} onClick={() => router.push(href)}>
                  <Td>
                    <Link href={href} onClick={stop} className="font-medium hover:text-[var(--som-primary)]">
                      {customer.full_name}
                    </Link>
                    <p className="m-0 mt-0.5 text-[12px] font-light tabular-nums text-[var(--som-gray)]">
                      {formatPhone(customer.phone)}
                      {customer.email && <span className="ml-2">· {customer.email}</span>}
                    </p>
                  </Td>
                  <Td>
                    <SegmentBadge segment={customer.segment} />
                  </Td>
                  <Td align="right">
                    <span className="tabular-nums">{customer.orders_count}</span>
                  </Td>
                  <Td align="right">
                    <span className="font-medium tabular-nums">{formatPrice(customer.total_spent)}</span>
                  </Td>
                  <Td muted>{formatRelativeDays(customer.last_order_at)}</Td>
                  <Td align="right">
                    <span className="tabular-nums">{customer.loyalty_points}</span>
                  </Td>
                  <Td align="right">
                    <Link
                      href={href}
                      onClick={stop}
                      aria-label={`Voir la fiche de ${customer.full_name}`}
                      className="inline-flex h-10 w-10 items-center justify-center text-[var(--som-gray)] transition-colors hover:text-[var(--som-primary)]"
                    >
                      <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div className="md:hidden">
        {customers.map((customer) => (
          <Link
            key={customer.id}
            href={`${CUSTOMERS_PATH}/${customer.id}`}
            className="block border-b border-[var(--som-border)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--som-surface-alt)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium text-[var(--som-ink)]">{customer.full_name}</span>
              <SegmentBadge segment={customer.segment} />
            </div>
            <p className="m-0 mt-1 text-[12px] font-light tabular-nums text-[var(--som-gray)]">
              {formatPhone(customer.phone)}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 text-[12px] font-light text-[var(--som-gray)]">
              <span>
                {customer.orders_count} commande{customer.orders_count > 1 ? "s" : ""} ·{" "}
                {formatRelativeDays(customer.last_order_at)}
              </span>
              <span className="text-[14px] font-medium tabular-nums text-[var(--som-ink)]">
                {formatPrice(customer.total_spent)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
