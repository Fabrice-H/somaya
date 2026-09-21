"use client";

import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { useOrderFilters } from "../../hooks/useOrderFilters";
import type { OrderSummary, OrdersStats } from "../../types";
import { OrderFiltersBar } from "./list/OrderFiltersBar";
import { OrderStatusTabs } from "./list/OrderStatusTabs";
import { OrdersEmptyState } from "./list/OrdersEmptyState";
import { OrdersLoadingIndicator } from "./list/OrdersLoadingIndicator";
import { OrdersPagination } from "./list/OrdersPagination";
import { OrdersStatsRow } from "./list/OrdersStatsRow";
import { OrdersTable } from "./list/OrdersTable";

interface OrdersClientProps {
  orders: OrderSummary[];
  stats: OrdersStats;
  total: number;
  page: number;
  totalPages: number;
}

export function OrdersClient({ orders, stats, total, page, totalPages }: OrdersClientProps) {
  const filters = useOrderFilters();

  return (
    <AdminPage eyebrow="Ventes" title="Commandes" description="Suivez et traitez les commandes de votre boutique.">
      <OrdersStatsRow stats={stats} />

      <div className="mt-10">
        <OrderStatusTabs
          current={filters.status}
          stats={stats}
          disabled={filters.isPending}
          onChange={filters.setStatus}
        />
      </div>

      <AdminCard padded={false} className="mt-6">
        <OrderFiltersBar
          search={filters.search}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          hasActiveFilters={filters.hasActiveFilters}
          isPending={filters.isPending}
          onSearchChange={filters.setSearch}
          onSearchClear={filters.clearSearch}
          onDateFromChange={filters.setDateFrom}
          onDateToChange={filters.setDateTo}
          onClearAll={filters.clearAll}
        />

        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[var(--som-border)] px-5 lg:px-6">
          <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
            <span className="tabular-nums">{total}</span> commande{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
          </p>
          {filters.isPending && <OrdersLoadingIndicator />}
        </div>

        {orders.length === 0 ? (
          <OrdersEmptyState filtered={filters.hasActiveFilters} />
        ) : (
          <OrdersTable orders={orders} />
        )}

        {orders.length > 0 && totalPages > 1 && (
          <OrdersPagination
            page={page}
            totalPages={totalPages}
            disabled={filters.isPending}
            onPageChange={filters.setPage}
          />
        )}
      </AdminCard>
    </AdminPage>
  );
}
