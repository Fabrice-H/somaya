"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";
import { createPriceLot, deletePriceLot, updatePriceLot } from "@/features/lots/server/actions";
import { validateLotForm } from "@/features/lots/utils";
import { useLotItemsEditor } from "./useLotItemsEditor";
import type { LotFormTab, PriceLot, PriceLotInput } from "@/features/lots/types";

export function useLotForm(lot?: PriceLot | null) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LotFormTab>("articles");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState(lot?.name ?? "");
  const [price, setPrice] = useState(lot?.price ?? 0);
  const [categoryId, setCategoryId] = useState(lot?.category_id ?? "");
  const [isActive, setIsActive] = useState(lot?.is_active ?? true);
  const items = useLotItemsEditor(lot?.items ?? [], setError);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateLotForm({ name, price, items: items.items });
    setError(validationError);
    if (validationError) return;

    const input: PriceLotInput = {
      name: name.trim(),
      price,
      category_id: categoryId || null,
      items: items.items,
      is_active: isActive,
    };

    startTransition(async () => {
      const result = lot ? await updatePriceLot(lot.id, input) : await createPriceLot(input);
      if (result.success) router.push(ADMIN_LOTS_PATH);
      else setError(result.error || "Une erreur est survenue");
    });
  };

  const remove = async () => {
    if (!lot) return;
    setIsDeleting(true);
    try {
      const result = await deletePriceLot(lot.id);
      if (!result.success) {
        alert(result.error || "Erreur lors de la suppression");
        return;
      }
      router.push(ADMIN_LOTS_PATH);
      router.refresh();
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return {
    fields: { name, price, categoryId, isActive },
    setName,
    setPrice,
    setCategoryId,
    setIsActive,
    items,
    error,
    activeTab,
    setActiveTab,
    isPending,
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    submit,
    remove,
    back: router.back,
  };
}
