"use client";

import { RichTextEditor } from "@/shared/components/rich-text/RichTextEditor";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";
import { useCategoryForm } from "@/features/categories/hooks/useCategoryForm";
import { normalizeRichText, parsePositionInput } from "@/features/categories/utils";
import { CategoryActiveToggle } from "./CategoryActiveToggle";
import { CategoryFormActions } from "./CategoryFormActions";
import { CategoryImageField } from "./CategoryImageField";
import { CategoryTextField } from "./CategoryTextField";
import type { Category } from "@/features/categories/types";

type CategoryFormProps = {
  category?: Category;
};

export function CategoryForm({ category }: CategoryFormProps) {
  const { form, loading, isDirty, change, changeName, submit } = useCategoryForm(category);

  return (
    <form onSubmit={submit}>
      <AdminPage
        eyebrow="Catalogue"
        title={category ? "Modifier la catégorie" : "Nouvelle catégorie"}
        description={form.name || "Renseignez le nom, l'URL et le visuel de la catégorie."}
        back={{ href: ADMIN_CATEGORIES_PATH, label: "Catégories" }}
        actions={<CategoryFormActions isDirty={isDirty} loading={loading} canSubmit={!!form.name && !!form.slug} />}
      >
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <AdminCard title="Informations">
            <div className="grid gap-6 md:grid-cols-2">
              <CategoryTextField
                id="name"
                label="Nom de la catégorie"
                required
                type="text"
                value={form.name}
                onChange={(e) => changeName(e.target.value)}
                placeholder="Ex : Sacs à main"
              />
              <CategoryTextField
                id="slug"
                label="Slug (URL)"
                required
                type="text"
                value={form.slug}
                onChange={(e) => change({ slug: e.target.value })}
                placeholder="sacs-a-main"
                className="font-mono"
                hint={`URL : /catalogue/${form.slug || "nom-categorie"}`}
              />
              <CategoryTextField
                id="position"
                label="Position d'affichage"
                type="number"
                value={form.position || ""}
                onChange={(e) => change({ position: parsePositionInput(e.target.value) })}
                min={0}
                placeholder="0"
                className="tabular-nums"
                hint="Les plus petits numéros s'affichent en premier."
              />
              <div className="md:col-span-2">
                <RichTextEditor
                  value={form.description || ""}
                  onChange={(value) => change({ description: normalizeRichText(value) })}
                  label="Description"
                  placeholder="Décrivez cette catégorie…"
                  hint="Utilisez les outils de mise en forme pour structurer votre texte."
                  minHeight={180}
                />
              </div>
            </div>
          </AdminCard>

          <div className="space-y-6">
            <AdminCard title="Visuel">
              <CategoryImageField imageUrl={form.image_url} onChange={(url) => change({ image_url: url })} />
            </AdminCard>
            <AdminCard title="Visibilité">
              <CategoryActiveToggle active={form.is_active} onToggle={() => change({ is_active: !form.is_active })} />
            </AdminCard>
          </div>
        </div>
      </AdminPage>
    </form>
  );
}
