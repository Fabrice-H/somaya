"use client";

import { Field } from "@/shared/components/admin/ui/Field";
import { RichTextEditor } from "@/shared/components/rich-text/RichTextEditor";
import { generateSlug } from "@/shared/lib/utils";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import type { CategoryOption } from "@/features/products/types";
import { FormSection } from "./FormSection";

interface InfoSectionProps {
  categories: CategoryOption[];
  isEditMode: boolean;
}

export function InfoSection({ categories, isEditMode }: InfoSectionProps) {
  const name = useProductFormStore((s) => s.form.name);
  const description = useProductFormStore((s) => s.form.description);
  const categoryId = useProductFormStore((s) => s.form.category_id);
  const setField = useProductFormStore((s) => s.setField);

  const handleNameChange = (value: string) => {
    setField("name", value);
    if (!isEditMode) setField("slug", generateSlug(value));
  };

  return (
    <FormSection step={2} title="Informations" description="Ce que vos clientes verront sur la fiche produit.">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="product-name" label="Nom du produit" required>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={255}
            placeholder="Ex : Sac cabas en cuir"
            className="input-som"
          />
        </Field>
        <Field id="product-category" label="Catégorie" hint="Aide vos clientes à trouver le produit.">
          <select
            id="product-category"
            value={categoryId || ""}
            onChange={(e) => setField("category_id", e.target.value || null)}
            className="input-som cursor-pointer"
          >
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-5">
        <RichTextEditor
          value={description || ""}
          onChange={(value) => setField("description", value && value !== "<p></p>" ? value : null)}
          label="Description"
          placeholder="Matière, coupe, conseils d'entretien…"
          hint="Quelques phrases suffisent. Utilisez les listes pour les détails."
          minHeight={220}
        />
      </div>
    </FormSection>
  );
}
