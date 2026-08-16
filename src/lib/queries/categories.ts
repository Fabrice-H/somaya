import { db, categories } from "@/lib/db";
import { eq, asc, sql } from "drizzle-orm";
import type { Category } from "@/lib/db/schema";

// ============================================================
// Server-side data fetching functions for Categories
// ============================================================

export type CategoryWithProductCount = Category & {
  productCount: number;
};

/**
 * Get all categories (active only by default)
 */
export async function getCategories(
  activeOnly = true
): Promise<Category[]> {
  const conditions = activeOnly ? eq(categories.isActive, true) : undefined;

  const result = await db.query.categories.findMany({
    where: conditions,
    orderBy: [asc(categories.position)],
  });

  return result;
}

/**
 * Get all categories with product count
 */
export async function getCategoriesWithProductCount(
  activeOnly = true
): Promise<CategoryWithProductCount[]> {
  const result = await db.execute(sql`
    SELECT
      c.*,
      COALESCE(COUNT(p.id), 0)::int as "productCount"
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
    ${activeOnly ? sql`WHERE c.is_active = true` : sql``}
    GROUP BY c.id
    ORDER BY c.position ASC
  `);

  return result.rows as CategoryWithProductCount[];
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const result = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });

  return result || null;
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  return result || null;
}
