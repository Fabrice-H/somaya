"use client";

import { ChevronDown, Wand2 } from "lucide-react";
import { Field } from "@/shared/components/admin/ui/Field";
import { generateSlug } from "@/shared/lib/utils";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { toNonNegativeInt } from "@/features/products/utils";

export function AdvancedSection() {
  const name = useProductFormStore((s) => s.form.name);
  const slug = useProductFormStore((s) => s.form.slug);
  const sortOrder = useProductFormStore((s) => s.form.sort_order);
  const lowStockThreshold = useProductFormStore((s) => s.form.low_stock_threshold);
  const setField = useProductFormStore((s) => s.setField);

  return (
    <details className="group border border-[var(--som-border)] bg-white">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)] lg:px-6 [&::-webkit-details-marker]:hidden">
        Options avancées
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden
          className="text-[var(--som-gray)] transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="grid gap-5 border-t border-[var(--som-border)] p-5 md:grid-cols-2 lg:p-6">
        <Field
          id="product-slug"
          label="Adresse de la page"
          hint="Générée à partir du nom. À ne modifier qu'en cas de besoin."
        >
          <div className="input-group-som">
            <input
              id="product-slug"
              type="text"
              value={slug}
              onChange={(e) => setField("slug", e.target.value)}
              maxLength={255}
              className="input-som !pl-4 font-mono !text-[14px]"
            />
            <button
              type="button"
              onClick={() => setField("slug", generateSlug(name))}
              disabled={!name}
              aria-label="Générer depuis le nom"
              title="Générer depuis le nom"
              className="flex w-12 shrink-0 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Wand2 size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </Field>
        <Field
          id="product-low-stock"
          label="Alerte stock faible"
          hint="Le produit est signalé « Stock faible » à partir de cette quantité."
        >
          <input
            id="product-low-stock"
            type="number"
            inputMode="numeric"
            value={lowStockThreshold || ""}
            onChange={(e) => setField("low_stock_threshold", toNonNegativeInt(e.target.value))}
            min={0}
            max={10000}
            placeholder="5"
            className="input-som tabular-nums"
          />
        </Field>
        <Field id="product-sort-order" label="Ordre d'affichage" hint="Les petits nombres apparaissent en premier.">
          <input
            id="product-sort-order"
            type="number"
            inputMode="numeric"
            value={sortOrder || ""}
            onChange={(e) => setField("sort_order", toNonNegativeInt(e.target.value))}
            min={0}
            max={10000}
            placeholder="0"
            className="input-som tabular-nums"
          />
        </Field>
      </div>
    </details>
  );
}
