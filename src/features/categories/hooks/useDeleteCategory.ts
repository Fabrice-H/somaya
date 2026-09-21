"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/features/categories/server/actions";
import type { Category } from "@/features/categories/types";

export function useDeleteCategory() {
  const router = useRouter();
  const [target, setTarget] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (!target) return;
    setLoading(true);
    const result = await deleteCategory(target.id);
    setLoading(false);
    if (!result.success) {
      alert(result.error || "Erreur lors de la suppression");
      return;
    }
    setTarget(null);
    router.refresh();
  };

  return { target, loading, open: setTarget, close: () => setTarget(null), confirm };
}
