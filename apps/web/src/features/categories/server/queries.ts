import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { categories, db } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { CATEGORIES_CACHE_TAG } from "../constants";
import { categoryIdSchema } from "../schemas";
import { toAdminCategory } from "./mappers";
import type { Category, CategoryOption } from "../types";

export const getActiveCategories = unstable_cache(
  () =>
    db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.position)],
    }),
  ["active-categories"],
  { revalidate: 300, tags: [CATEGORIES_CACHE_TAG] }
);

export const getCategoryBySlug = cache(async (slug: string) => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  return category ?? null;
});

export async function getCategories(): Promise<Category[]> {
  await assertAdmin();
  const rows = await db.query.categories.findMany({ orderBy: [asc(categories.position)] });
  return rows.map(toAdminCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await assertAdmin();
  if (!categoryIdSchema.safeParse(id).success) return null;
  const row = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  return row ? toAdminCategory(row) : null;
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  await assertAdmin();
  return db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [asc(categories.name)],
    columns: { id: true, name: true, slug: true },
  });
}
