"use client";

import { useState } from "react";
import { Field } from "@/shared/components/admin/ui/Field";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { parseList, toNonNegativeInt } from "@/features/products/utils";
import { ColorPicker } from "./ColorPicker";
import { FormSection } from "./FormSection";

export function StockSection() {
  const stock = useProductFormStore((s) => s.form.stock);
  const colors = useProductFormStore((s) => s.form.colors);
  const sizes = useProductFormStore((s) => s.form.sizes);
  const material = useProductFormStore((s) => s.form.material);
  const sku = useProductFormStore((s) => s.form.sku);
  const setField = useProductFormStore((s) => s.setField);
  const [sizesDraft, setSizesDraft] = useState<string | null>(null);

  return (
    <FormSection step={4} title="Stock & options">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="product-stock" label="Quantité en stock" hint="À 0, le produit s'affiche « Épuisé ».">
          <input
            id="product-stock"
            type="number"
            inputMode="numeric"
            value={stock || ""}
            onChange={(e) => setField("stock", toNonNegativeInt(e.target.value))}
            min={0}
            max={1000000}
            placeholder="0"
            className="input-som tabular-nums"
          />
        </Field>
        <Field id="product-sizes" label="Tailles (optionnel)" hint="Séparées par des virgules. Vide = taille unique.">
          <input
            id="product-sizes"
            type="text"
            value={sizesDraft ?? sizes.join(", ")}
            onChange={(e) => {
              setSizesDraft(e.target.value);
              setField("sizes", parseList(e.target.value));
            }}
            onBlur={() => setSizesDraft(null)}
            placeholder="S, M, L, XL"
            className="input-som"
          />
        </Field>
        <Field id="product-material" label="Matière (optionnel)">
          <input
            id="product-material"
            type="text"
            value={material || ""}
            onChange={(e) => setField("material", e.target.value || null)}
            placeholder="Ex : Cuir véritable, coton bio"
            maxLength={255}
            className="input-som"
          />
        </Field>
        <Field id="product-sku" label="Référence (optionnel)" hint="Votre code interne pour retrouver le produit.">
          <input
            id="product-sku"
            type="text"
            value={sku || ""}
            onChange={(e) => setField("sku", e.target.value || null)}
            placeholder="Ex : SAC-001"
            maxLength={100}
            className="input-som"
          />
        </Field>
      </div>
      <div className="mt-6">
        <p className="label-som">Couleurs (optionnel)</p>
        <ColorPicker value={colors} onChange={(next) => setField("colors", next)} />
        <p className="help-som m-0">Touchez une couleur pour l&rsquo;ajouter ou la retirer.</p>
      </div>
    </FormSection>
  );
}
