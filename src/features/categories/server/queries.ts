import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq, sql } from "drizzle-orm";
import { categories, db } from "@/shared/lib/db";
import { CATEGORIES_CACHE_TAG } from "../constants";
import type { CategoryWithProductCount } from "../types";

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

export async function getCategoriesWithProductCount() {
  const result = await db.execute(sql`
    SELECT c.*, COALESCE(COUNT(p.id), 0)::int AS "productCount"
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.position ASC
  `);
  return result.rows as CategoryWithProductCount[];
}
