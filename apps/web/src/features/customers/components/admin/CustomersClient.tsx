"use client";

import { Loader2, Users, X } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { SearchField } from "@/shared/components/admin/ui/SearchField";
import { Tabs } from "@/shared/components/admin/ui/Tabs";
import { CUSTOMER_SEGMENT_FILTERS, CUSTOMER_SORTS } from "../../constants";
import { useCustomerFilters } from "../../hooks/useCustomerFilters";
import type { CustomerSummary, CustomersStats } from "../../types";
import { CustomersPagination } from "./list/CustomersPagination";
import { CustomersStatsRow } from "./list/CustomersStatsRow";
import { CustomersTable } from "./list/CustomersTable";

interface CustomersClientProps {
  customers: CustomerSummary[];
  stats: CustomersStats;
  total: number;
  page: number;
  totalPages: number;
}

export function CustomersClient({ customers, stats, total, page, totalPages }: CustomersClientProps) {
  const filters = useCustomerFilters();
  const tabs = CUSTOMER_SEGMENT_FILTERS.map(({ value, label }) => ({
    value,
    label,
    count: value === "all" ? stats.total : stats[value],
  }));

  return (
    <AdminPage
      eyebrow="Ventes"
      title="Clients"
      description="Retrouvez vos clientes et clients, leurs commandes et leur fidélité."
    >
      <CustomersStatsRow stats={stats} />

      <div
        aria-busy={filters.isPending}
        className={`mt-10 ${filters.isPending ? "pointer-events-none opacity-60" : ""}`}
      >
        <Tabs<string> items={tabs} value={filters.segment} onChange={filters.setSegment} label="Filtrer par segment" />
      </div>

      <AdminCard padded={false} className="mt-6">
        <div className="flex flex-col gap-3 border-b border-[var(--som-border)] p-5 md:flex-row md:items-center lg:px-6">
          <SearchField
            value={filters.search}
            onChange={filters.setSearch}
            placeholder="Nom, téléphone ou email…"
            label="Rechercher un client"
          />
          <label className="input-group-som w-full sm:max-w-[240px]">
            <span className="sr-only">Trier par</span>
            <select
              value={filters.sort}
              onChange={(event) => filters.setSort(event.target.value)}
              className="input-som"
            >
              {CUSTOMER_SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  Trier : {sort.label}
                </option>
              ))}
            </select>
          </label>
          {filters.hasActiveFilters && (
            <button
              type="button"
              onClick={filters.clearAll}
              disabled={filters.isPending}
              className="btn-link self-start md:ml-auto md:self-center"
            >
              <X size={15} strokeWidth={1.5} aria-hidden />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[var(--som-border)] px-5 lg:px-6">
          <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
            <span className="tabular-nums">{total}</span> client{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>
          {filters.isPending && (
            <span
              role="status"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]"
            >
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin text-[var(--som-primary)]" aria-hidden />
              Chargement…
            </span>
          )}
        </div>

        {customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun client trouvé"
            description={
              filters.hasActiveFilters
                ? "Essayez de modifier ou de réinitialiser vos filtres."
                : "Les clients apparaissent ici dès leur première commande."
            }
          />
        ) : (
          <CustomersTable customers={customers} />
        )}

        {customers.length > 0 && totalPages > 1 && (
          <CustomersPagination
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
