"use client";

import { Field } from "@/shared/components/admin/ui/Field";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { toNonNegativeInt } from "@/features/products/utils";
import { FormSection } from "./FormSection";
import { PriceInput } from "./PriceInput";

export function PriceSection() {
  const price = useProductFormStore((s) => s.form.price);
  const oldPrice = useProductFormStore((s) => s.form.old_price);
  const setField = useProductFormStore((s) => s.setField);

  return (
    <FormSection step={3} title="Prix">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="product-price" label="Prix de vente" required>
          <PriceInput
            id="product-price"
            value={price || ""}
            onChange={(value) => setField("price", toNonNegativeInt(value))}
            required
          />
        </Field>
        <Field id="product-old-price" label="Ancien prix barré (optionnel)" hint="Laisser vide si pas de promotion.">
          <PriceInput
            id="product-old-price"
            value={oldPrice ?? ""}
            placeholder=""
            onChange={(value) => setField("old_price", value === "" ? null : toNonNegativeInt(value))}
          />
        </Field>
      </div>
    </FormSection>
  );
}
