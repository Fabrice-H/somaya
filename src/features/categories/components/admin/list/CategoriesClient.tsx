"use client";

import { useDeleteCategory } from "@/features/categories/hooks/useDeleteCategory";
import { getCategoryStats } from "@/features/categories/utils";
import { CategoriesEmptyState } from "./CategoriesEmptyState";
import { CategoryCard } from "./CategoryCard";
import { CategoryStats } from "./CategoryStats";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import type { Category } from "@/features/categories/types";

type CategoriesClientProps = {
  categories: Category[];
};

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const deletion = useDeleteCategory();

  return (
    <div className="space-y-6">
      <CategoryStats {...getCategoryStats(categories)} />

      {categories.length === 0 ? (
        <CategoriesEmptyState />
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px"
          style={{ background: "rgba(81,31,41,0.1)" }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onDelete={deletion.open} />
          ))}
        </div>
      )}

      {deletion.target && (
        <DeleteCategoryDialog
          name={deletion.target.name}
          loading={deletion.loading}
          onCancel={deletion.close}
          onConfirm={deletion.confirm}
        />
      )}
    </div>
  );
}
