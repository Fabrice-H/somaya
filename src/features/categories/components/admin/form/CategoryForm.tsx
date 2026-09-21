"use client";

import { RichTextEditor } from "@/shared/components/rich-text/RichTextEditor";
import { useCategoryForm } from "@/features/categories/hooks/useCategoryForm";
import { normalizeRichText, parsePositionInput } from "@/features/categories/utils";
import { CategoryActiveToggle } from "./CategoryActiveToggle";
import { CategoryFormHeader } from "./CategoryFormHeader";
import { CategoryImageField } from "./CategoryImageField";
import { CategoryTextField } from "./CategoryTextField";
import type { Category } from "@/features/categories/types";

type CategoryFormProps = {
  category?: Category;
};

export function CategoryForm({ category }: CategoryFormProps) {
  const { form, loading, isDirty, change, changeName, submit, back } = useCategoryForm(category);

  return (
    <form onSubmit={submit}>
      <CategoryFormHeader
        isEdit={!!category}
        name={form.name}
        isDirty={isDirty}
        loading={loading}
        canSubmit={!!form.name && !!form.slug}
        onBack={back}
      />

      <div style={{ padding: "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1000 }}>
          <div className="space-y-6">
            <CategoryTextField
              id="name"
              label="Nom de la catégorie *"
              type="text"
              value={form.name}
              onChange={(e) => changeName(e.target.value)}
              placeholder="Ex: Sacs à main"
            />

            <CategoryTextField
              id="slug"
              label="Slug (URL) *"
              type="text"
              value={form.slug}
              onChange={(e) => change({ slug: e.target.value })}
              placeholder="sacs-a-main"
              className="w-full font-mono"
              hint={`URL: /catalogue/${form.slug || "nom-categorie"}`}
            />

            <CategoryTextField
              id="position"
              label="Position d'affichage"
              type="number"
              value={form.position || ""}
              onChange={(e) => change({ position: parsePositionInput(e.target.value) })}
              min={0}
              placeholder="0"
              className="w-32"
              hint="Les catégories avec un numéro plus petit s'affichent en premier"
            />

            <RichTextEditor
              value={form.description || ""}
              onChange={(value) => change({ description: normalizeRichText(value) })}
              label="Description"
              placeholder="Décrivez cette catégorie..."
              hint="Utilisez les outils de mise en forme pour structurer votre texte"
              minHeight={180}
            />

            <CategoryActiveToggle active={form.is_active} onToggle={() => change({ is_active: !form.is_active })} />
          </div>

          <CategoryImageField imageUrl={form.image_url} onChange={(url) => change({ image_url: url })} />
        </div>
      </div>
    </form>
  );
}
