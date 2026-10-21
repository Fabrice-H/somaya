"use client";

import { useState, useTransition } from "react";
import { updateProduct } from "@/features/products/server/actions";
import { toProductInput } from "@/features/products/utils";
import type { Product } from "@/features/products/types";

export function useToggleVisibility() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (product: Product) => {
    setPendingId(product.id);
    startTransition(async () => {
      try {
        const result = await updateProduct(product.id, { ...toProductInput(product), is_active: !product.is_active });
        if (!result.success) alert(result.error);
      } catch {
        alert("Une erreur est survenue");
      } finally {
        setPendingId(null);
      }
    });
  };

  return { pendingId, toggle };
}
