"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { parseList } from "@/features/products/utils";
import type { CategoryOption } from "@/features/products/types";
import { generateSlug } from "@/shared/lib/utils";
import { RichTextEditor } from "@/shared/components/rich-text/RichTextEditor";
import { FormCard } from "./FormCard";
import { FormField, INPUT_CLASS } from "./FormField";

interface GeneralSectionProps {
  categories: CategoryOption[];
  isEditMode: boolean;
}

export function GeneralSection({ categories, isEditMode }: GeneralSectionProps) {
  const name = useProductFormStore((s) => s.form.name);
  const slug = useProductFormStore((s) => s.form.slug);
  const description = useProductFormStore((s) => s.form.description);
  const categoryId = useProductFormStore((s) => s.form.category_id);
  const sizes = useProductFormStore((s) => s.form.sizes);
  const material = useProductFormStore((s) => s.form.material);
  const setField = useProductFormStore((s) => s.setField);
  const [sizesDraft, setSizesDraft] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setField("name", value);
    if (!isEditMode) setField("slug", generateSlug(value));
  };

  const handleSizesChange = (value: string) => {
    setSizesDraft(value);
    setField("sizes", parseList(value));
  };

  return (
    <FormCard title="Informations générales">
      <div className="space-y-4">
        <FormField label="Nom du produit *">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={255}
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Slug (URL) *" hint="Lettres minuscules, chiffres et tirets uniquement">
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setField("slug", e.target.value)}
              required
              pattern="[a-z0-9-]+"
              maxLength={255}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--som-border-input)] hover:border-[var(--som-border-input-hover)] focus:outline-none focus:ring-2 focus:ring-black/10 text-[#3c161e] font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setField("slug", generateSlug(name))}
              disabled={!name}
              title="Générer depuis le nom"
              className="px-3 py-2.5 rounded-lg border border-[#511f29]/20 hover:bg-[#511f29]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 size={18} className="text-[#3c161e]/70" />
            </button>
          </div>
        </FormField>

        <FormField label="Catégorie">
          <select
            value={categoryId || ""}
            onChange={(e) => setField("category_id", e.target.value || null)}
            className={INPUT_CLASS}
          >
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tailles disponibles" hint="Séparées par des virgules. Laisser vide = taille unique">
            <input
              type="text"
              value={sizesDraft ?? sizes.join(", ")}
              onChange={(e) => handleSizesChange(e.target.value)}
              onBlur={() => setSizesDraft(null)}
              placeholder="S, M, L, XL"
              className={INPUT_CLASS}
            />
          </FormField>

          <FormField label="Matière">
            <input
              type="text"
              value={material || ""}
              onChange={(e) => setField("material", e.target.value || null)}
              placeholder="Ex: Cuir véritable, Coton bio"
              maxLength={255}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <RichTextEditor
          value={description || ""}
          onChange={(value) => setField("description", value && value !== "<p></p>" ? value : null)}
          label="Description"
          placeholder="Décrivez votre produit en détail..."
          hint="Utilisez les outils de mise en forme pour structurer votre texte"
          minHeight={250}
        />
      </div>
    </FormCard>
  );
}
