"use client";

import clsx from "clsx";
import { useLotsManager } from "@/features/lots/hooks/useLotsManager";
import { LOTS_TABLE_COLUMNS, LOTS_TABLE_GRID } from "@/features/lots/constants";
import { DeleteLotModal } from "./DeleteLotModal";
import { LotCategoryFilters } from "./LotCategoryFilters";
import { LotRow } from "./LotRow";
import { LotsEmptyState } from "./LotsEmptyState";
import { LotsHeader } from "./LotsHeader";
import { LotsStatsGrid } from "./LotsStatsGrid";
import type { PriceLot } from "@/features/lots/types";

type LotsPageContentProps = {
  initialLots: PriceLot[];
};

export function LotsPageContent({ initialLots }: LotsPageContentProps) {
  const manager = useLotsManager(initialLots);

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <LotsHeader totalLots={manager.stats.total} totalArticles={manager.stats.articles} />
        <LotsStatsGrid stats={manager.stats} />

        <div className="bg-white rounded-xl border border-[#e8ddd4] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e8ddd4]">
            <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#000000]">TOUS LES LOTS</h2>
            <LotCategoryFilters categories={manager.categories} active={manager.filter} onChange={manager.setFilter} />
          </div>

          {manager.lots.length === 0 ? (
            <LotsEmptyState />
          ) : (
            <div className="overflow-x-auto">
              <div
                className={clsx(
                  "hidden md:grid gap-4 px-5 py-3 bg-[#fafafa] border-b border-[#e8ddd4] text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6b6b6b]",
                  LOTS_TABLE_GRID
                )}
              >
                {LOTS_TABLE_COLUMNS.map((column, index) => (
                  <div key={index}>{column}</div>
                ))}
              </div>

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
            </div>
          )}
        </div>
      </div>

      {manager.deleteTarget && (
        <DeleteLotModal
          name={manager.deleteTarget.name}
          isLoading={manager.isDeleting}
          onConfirm={manager.confirmDelete}
          onCancel={manager.closeDelete}
        />
      )}
    </>
  );
}
