"use client";

import { useOrderFilters } from "../../hooks/useOrderFilters";
import type { OrderSummary, OrdersStats } from "../../types";
import { OrderFiltersBar } from "./list/OrderFiltersBar";
import { OrderStatusTabs } from "./list/OrderStatusTabs";
import { OrdersEmptyState } from "./list/OrdersEmptyState";
import { OrdersLoadingIndicator } from "./list/OrdersLoadingIndicator";
import { OrdersPagination } from "./list/OrdersPagination";
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
    <div style={{ padding: "32px 40px" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#000000] mb-1">Commandes</h1>
        <p className="text-sm text-[#6b6b6b]">Gérez les commandes de votre boutique</p>
      </div>

      <div className="space-y-4 mb-6">
        <OrderStatusTabs
          current={filters.status}
          stats={stats}
          disabled={filters.isPending}
          onChange={filters.setStatus}
        />
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
        {filters.isPending && <OrdersLoadingIndicator />}
      </div>

      {total > 0 && (
        <p className="text-sm text-[#6b6b6b] mb-4">
          {total} commande{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
        </p>
      )}

      {orders.length === 0 ? (
        <OrdersEmptyState filtered={filters.hasActiveFilters} />
      ) : (
        <>
          <OrdersTable orders={orders} />
          {totalPages > 1 && (
            <OrdersPagination
              page={page}
              totalPages={totalPages}
              disabled={filters.isPending}
              onPageChange={filters.setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
