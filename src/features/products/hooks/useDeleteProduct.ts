"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "../server/actions";

export function useDeleteProduct(onDeleted?: () => void) {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  const confirm = () => {
    if (!targetId) return;
    startDeleting(async () => {
      try {
        const result = await deleteProduct(targetId);
        if (!result.success) {
          alert(result.error);
          return;
        }
        onDeleted?.();
      } catch {
        alert("Une erreur est survenue");
      } finally {
        setTargetId(null);
      }
    });
  };

  return {
    targetId,
    isDeleting,
    request: setTargetId,
    cancel: () => setTargetId(null),
    confirm,
  };
}
