"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/shared/lib/utils";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";
import { createCategory, updateCategory } from "@/features/categories/server/actions";
import { toCategoryFormValues } from "@/features/categories/utils";
import type { Category, CategoryInput } from "@/features/categories/types";

export function useCategoryForm(category?: Category) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryInput>(() => toCategoryFormValues(category));
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const change = (updates: Partial<CategoryInput>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const changeName = (name: string) => change(category ? { name } : { name, slug: generateSlug(name) });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = category ? await updateCategory(category.id, form) : await createCategory(form);
      if (!result.success) {
        alert(result.error || "Une erreur est survenue");
        return;
      }
      router.push(ADMIN_CATEGORIES_PATH);
      router.refresh();
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, isDirty, change, changeName, submit, back: router.back };
}
