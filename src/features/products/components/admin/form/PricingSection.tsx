"use client";

import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { toNonNegativeInt } from "@/features/products/utils";
import { FormCard } from "./FormCard";
import { FormField, INPUT_CLASS } from "./FormField";

export function PricingSection() {
  const price = useProductFormStore((s) => s.form.price);
  const sku = useProductFormStore((s) => s.form.sku);
  const stock = useProductFormStore((s) => s.form.stock);
  const lowStockThreshold = useProductFormStore((s) => s.form.low_stock_threshold);
  const setField = useProductFormStore((s) => s.setField);

  return (
    <FormCard title="Tarification">
      <div className="space-y-4">
        <FormField label="Prix (FCFA) *">
          <input
            type="number"
            value={price || ""}
            onChange={(e) => setField("price", toNonNegativeInt(e.target.value))}
            required
            min={0}
            max={100000000}
            className={INPUT_CLASS}
            placeholder="0"
          />
        </FormField>

        <FormField label="SKU">
          <input
            type="text"
            value={sku || ""}
            onChange={(e) => setField("sku", e.target.value || null)}
            placeholder="Ex: PRD-001"
            maxLength={100}
            className={INPUT_CLASS}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Stock">
            <input
              type="number"
              value={stock || ""}
              onChange={(e) => setField("stock", toNonNegativeInt(e.target.value))}
              min={0}
              max={1000000}
              className={INPUT_CLASS}
              placeholder="0"
            />
          </FormField>
          <FormField label="Seuil alerte">
            <input
              type="number"
              value={lowStockThreshold || ""}
              onChange={(e) => setField("low_stock_threshold", toNonNegativeInt(e.target.value))}
              min={0}
              max={10000}
              className={INPUT_CLASS}
              placeholder="5"
            />
          </FormField>
        </div>
      </div>
    </FormCard>
  );
}
