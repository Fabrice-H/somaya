"use client";

import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { Table, Th } from "@/shared/components/admin/ui/Table";
import { useLotsManager } from "@/features/lots/hooks/useLotsManager";
import { DeleteLotModal } from "./DeleteLotModal";
import { LotCategoryFilters } from "./LotCategoryFilters";
import { LotRow } from "./LotRow";
import { LotsEmptyState } from "./LotsEmptyState";
import { LotsStatsGrid } from "./LotsStatsGrid";
import { NewLotLink } from "./NewLotLink";
import type { PriceLot } from "@/features/lots/types";

type LotsPageContentProps = {
  initialLots: PriceLot[];
};

export function LotsPageContent({ initialLots }: LotsPageContentProps) {
  const manager = useLotsManager(initialLots);
  const { total, articles } = manager.stats;

  return (
    <AdminPage
      eyebrow="Boutique · Par budget"
      title="Lots de prix"
      description={`${total} lot${total > 1 ? "s" : ""} · ${articles} article${articles > 1 ? "s" : ""}`}
      actions={<NewLotLink />}
    >
      <LotsStatsGrid stats={manager.stats} />

      <AdminCard title="Tous les lots" padded={false}>
        <LotCategoryFilters categories={manager.categories} active={manager.filter} onChange={manager.setFilter} />

        {manager.lots.length === 0 ? (
          <LotsEmptyState />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Lot</Th>
                <Th align="right">Prix</Th>
                <Th align="right">Articles</Th>
                <Th>Stock</Th>
                <Th>Visibilité</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {manager.lots.map((lot) => (
                <LotRow
                  key={lot.id}
                  lot={lot}
                  selected={manager.selectedId === lot.id}
                  loading={manager.loadingId === lot.id}
                  onSelect={() => manager.toggleSelected(lot.id)}
                  onToggle={() => manager.toggleActive(lot)}
                  onDelete={() => manager.openDelete(lot)}
                />
              ))}
            </tbody>
          </Table>
        )}
      </AdminCard>

      {manager.deleteTarget && (
        <DeleteLotModal
          name={manager.deleteTarget.name}
          isLoading={manager.isDeleting}
          onConfirm={manager.confirmDelete}
          onCancel={manager.closeDelete}
        />
      )}
    </AdminPage>
  );
}
