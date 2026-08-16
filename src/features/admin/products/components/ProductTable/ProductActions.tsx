"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  productName: string;
  isActive: boolean;
  isLoading: boolean;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
}

export const ProductActions = memo(function ProductActions({
  productId,
  productName,
  isActive,
  isLoading,
  onToggle,
  onDelete,
}: ProductActionsProps) {
  const [localLoading, setLocalLoading] = useState<"toggle" | "delete" | null>(
    null
  );

  const handleToggle = useCallback(async () => {
    setLocalLoading("toggle");
    try {
      await onToggle(productId, isActive);
    } finally {
      setLocalLoading(null);
    }
  }, [productId, isActive, onToggle]);

  const handleDelete = useCallback(async () => {
    if (!confirm(`Supprimer "${productName}" ?`)) return;
    setLocalLoading("delete");
    try {
      await onDelete(productId, productName);
    } finally {
      setLocalLoading(null);
    }
  }, [productId, productName, onDelete]);

  const isDisabled = isLoading || localLoading !== null;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className="p-1.5 text-[#511F29]/50 hover:text-[#511F29] hover:bg-[#511F29]/5 rounded
                 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isActive ? "Désactiver" : "Activer"}
      >
        {localLoading === "toggle" ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isActive ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
      <Link
        href={`/admin/produits/${productId}`}
        className="p-1.5 text-[#511F29]/50 hover:text-[#511F29] hover:bg-[#511F29]/5 rounded"
      >
        <Edit size={18} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDisabled}
        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {localLoading === "delete" ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </div>
  );
});
