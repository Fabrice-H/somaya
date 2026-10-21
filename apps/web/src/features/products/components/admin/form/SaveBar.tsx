"use client";

import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { useProductFormMeta, useProductFormStore } from "@/features/products/stores/product-form-store";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";

export function SaveBar() {
  const name = useProductFormStore((s) => s.form.name);
  const slug = useProductFormStore((s) => s.form.slug);
  const { isDirty, isSubmitting, error } = useProductFormMeta();

  return (
    <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-[var(--som-border)] bg-white/95 px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:-mx-10 lg:px-10">
      {error && (
        <p
          role="alert"
          className="m-0 mb-3 flex items-start gap-2 border-l-2 border-[var(--som-error)] bg-[var(--som-error-tint)] px-3 py-2 text-[13px] text-[var(--som-error)]"
        >
          <AlertCircle size={16} strokeWidth={1.5} aria-hidden className="mt-px shrink-0" />
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="m-0 mr-auto text-[12px] font-light text-[var(--som-gray)]">
          {!name
            ? "Donnez un nom au produit pour l'enregistrer."
            : isDirty
              ? "Modifications non enregistrées"
              : "Aucune modification"}
        </p>
        <Link href={ADMIN_PRODUCTS_PATH} className="btn-secondary btn-sm">
          Annuler
        </Link>
        <button type="submit" disabled={isSubmitting || !name || !slug} className="btn-primary btn-sm">
          {isSubmitting && <Loader2 size={15} className="animate-spin" aria-hidden />}
          {isSubmitting ? "Enregistrement…" : "Enregistrer le produit"}
        </button>
      </div>
    </div>
  );
}
