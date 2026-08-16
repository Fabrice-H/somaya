"use client";

import { memo, useCallback, useMemo } from "react";
import { Wand2 } from "lucide-react";
import { useProductFormStore } from "../../store";
import { generateSlug } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { Category } from "@/features/admin/categories/actions";

interface GeneralSectionProps {
  categories: Category[];
  isEditMode: boolean;
}

export const GeneralSection = memo(function GeneralSection({
  categories,
  isEditMode,
}: GeneralSectionProps) {
  const name = useProductFormStore((s) => s.form.name);
  const slug = useProductFormStore((s) => s.form.slug);
  const description = useProductFormStore((s) => s.form.description);
  const categoryId = useProductFormStore((s) => s.form.category_id);
  const sizes = useProductFormStore((s) => s.form.sizes);
  const material = useProductFormStore((s) => s.form.material);
  const setField = useProductFormStore((s) => s.setField);

  // Convert sizes array to comma-separated string for display
  const sizesText = useMemo(() => sizes.join(", "), [sizes]);

  const handleNameChange = useCallback(
    (value: string) => {
      setField("name", value);
      // Auto-generate slug only for new products
      if (!isEditMode) {
        setField("slug", generateSlug(value));
      }
    },
    [setField, isEditMode]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      // Store empty string as null
      setField("description", value && value !== "<p></p>" ? value : null);
    },
    [setField]
  );

  const handleSizesChange = useCallback(
    (value: string) => {
      // Parse comma-separated string to array, trim each value
      const sizesArray = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      setField("sizes", sizesArray);
    },
    [setField]
  );

  const handleGenerateSlug = useCallback(() => {
    if (name) {
      setField("slug", generateSlug(name));
    }
  }, [name, setField]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-[#511F29] mb-4">
        Informations générales
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
            Nom du produit *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={255}
            className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                     focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                     text-[#511F29]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
            Slug (URL) *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setField("slug", e.target.value)}
              required
              pattern="[a-z0-9-]+"
              maxLength={255}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#511F29]/20
                       focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                       text-[#511F29] font-mono text-sm"
            />
            <button
              type="button"
              onClick={handleGenerateSlug}
              disabled={!name}
              title="Générer depuis le nom"
              className="px-3 py-2.5 rounded-lg border border-[#511F29]/20
                       hover:bg-[#511F29]/5 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 size={18} className="text-[#511F29]/70" />
            </button>
          </div>
          <p className="mt-1 text-xs text-[#511F29]/50">
            Lettres minuscules, chiffres et tirets uniquement
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
            Catégorie
          </label>
          <select
            value={categoryId || ""}
            onChange={(e) => setField("category_id", e.target.value || null)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                     focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                     text-[#511F29]"
          >
            <option value="">Sans catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sizes and Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
              Tailles disponibles
            </label>
            <input
              type="text"
              value={sizesText}
              onChange={(e) => handleSizesChange(e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                       focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                       text-[#511F29]"
            />
            <p className="mt-1 text-xs text-[#511F29]/50">
              Séparées par des virgules. Laisser vide = taille unique
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
              Matière
            </label>
            <input
              type="text"
              value={material || ""}
              onChange={(e) => setField("material", e.target.value || null)}
              placeholder="Ex: Cuir véritable, Coton bio"
              maxLength={255}
              className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                       focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                       text-[#511F29]"
            />
          </div>
        </div>

        <RichTextEditor
          value={description || ""}
          onChange={handleDescriptionChange}
          label="Description"
          placeholder="Décrivez votre produit en détail..."
          hint="Utilisez les outils de mise en forme pour structurer votre texte"
          minHeight={250}
        />
      </div>
    </div>
  );
});
