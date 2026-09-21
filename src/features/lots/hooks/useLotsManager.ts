"use client";

import { useMemo, useState, useTransition } from "react";
import { deletePriceLot, togglePriceLotActive } from "@/features/lots/server/actions";
import { getLotCategories, getLotsStats } from "@/features/lots/utils";
import type { PriceLot } from "@/features/lots/types";

export function useLotsManager(initialLots: PriceLot[]) {
  const [lots, setLots] = useState(initialLots);
  const [, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PriceLot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = useMemo(() => getLotsStats(lots), [lots]);
  const categories = useMemo(() => getLotCategories(lots), [lots]);
  const visibleLots = filter ? lots.filter((lot) => lot.category_id === filter) : lots;

  const toggleActive = (lot: PriceLot) => {
    const isActive = !lot.is_active;
    setLoadingId(lot.id);
    startTransition(async () => {
      const result = await togglePriceLotActive(lot.id, isActive);
      if (result.success) {
        setLots((prev) => prev.map((item) => (item.id === lot.id ? { ...item, is_active: isActive } : item)));
      }
      setLoadingId(null);
    });
  };

  const toggleSelected = (id: string) => setSelectedId((prev) => (prev === id ? null : id));

  const closeDelete = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setIsDeleting(true);
    setLoadingId(id);
    const result = await deletePriceLot(id);
    if (result.success) {
      setLots((prev) => prev.filter((lot) => lot.id !== id));
      if (filter && !lots.some((lot) => lot.id !== id && lot.category_id === filter)) setFilter(null);
    }
    setIsDeleting(false);
    setLoadingId(null);
    setDeleteTarget(null);
  };

  return {
    lots: visibleLots,
    stats,
    categories,
    filter,
    setFilter,
    selectedId,
    toggleSelected,
    loadingId,
    toggleActive,
    deleteTarget,
    isDeleting,
    openDelete: setDeleteTarget,
    closeDelete,
    confirmDelete,
  };
}
