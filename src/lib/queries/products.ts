import { db, products, categories, productLots } from "@/lib/db";
import { eq, desc, asc, and, ilike, sql, inArray } from "drizzle-orm";
import type { Product, ProductWithCategory, ProductWithCategoryAndLots, ProductLot } from "@/lib/db/schema";

// ============================================================
// Server-side data fetching functions
// Use these in Server Components and Server Actions
// ============================================================

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "sortOrder";
  sortOrder?: "asc" | "desc";
};

export type PaginatedProducts = {
  products: ProductWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Get all products with optional filters (Server-side)
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  const {
    categorySlug,
    search,
    isActive = true,
    isFeatured,
    isNew,
    isBestseller,
    page = 1,
    limit = 20,
    sortBy = "sortOrder",
    sortOrder = "asc",
  } = filters;

  // Build where conditions
  const conditions = [];

  if (isActive !== undefined) {
    conditions.push(eq(products.isActive, isActive));
  }
  if (isFeatured !== undefined) {
    conditions.push(eq(products.isFeatured, isFeatured));
  }
  if (isNew !== undefined) {
    conditions.push(eq(products.isNew, isNew));
  }
  if (isBestseller !== undefined) {
    conditions.push(eq(products.isBestseller, isBestseller));
  }
  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  // Category filter (need to join)
  let categoryCondition;
  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (category) {
      categoryCondition = eq(products.categoryId, category.id);
      conditions.push(categoryCondition);
    }
  }

  // Build query
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause);
  const total = Number(countResult[0]?.count || 0);

  // Sorting
  const orderByColumn = {
    name: products.name,
    price: products.price,
    createdAt: products.createdAt,
    sortOrder: products.sortOrder,
  }[sortBy];

  const orderFn = sortOrder === "desc" ? desc : asc;

  // Fetch products with category
  const offset = (page - 1) * limit;
  const result = await db.query.products.findMany({
    where: whereClause,
    with: {
      category: true,
    },
    orderBy: [orderFn(orderByColumn)],
    limit,
    offset,
  });

  return {
    products: result as ProductWithCategory[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single product by ID
 */
export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
    },
  });

  return result as ProductWithCategory | null;
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const result = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: {
      category: true,
    },
  });

  return result as ProductWithCategory | null;
}

/**
 * Get featured products (for homepage)
 */
export async function getFeaturedProducts(
  limit = 8
): Promise<ProductWithCategory[]> {
  const result = await db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
    with: {
      category: true,
    },
    orderBy: [asc(products.sortOrder)],
    limit,
  });

  return result as ProductWithCategory[];
}

/**
 * Get bestseller products
 */
export async function getBestsellerProducts(
  limit = 8
): Promise<ProductWithCategory[]> {
  const result = await db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isBestseller, true)),
    with: {
      category: true,
    },
    orderBy: [desc(products.viewsCount)],
    limit,
  });

  return result as ProductWithCategory[];
}

/**
 * Get new arrivals
 */
export async function getNewProducts(limit = 8): Promise<ProductWithCategory[]> {
  const result = await db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isNew, true)),
    with: {
      category: true,
    },
    orderBy: [desc(products.createdAt)],
    limit,
  });

  return result as ProductWithCategory[];
}

/**
 * Get related products (same category, excluding current)
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<ProductWithCategory[]> {
  if (!categoryId) return [];

  const result = await db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      eq(products.categoryId, categoryId),
      sql`${products.id} != ${productId}`
    ),
    with: {
      category: true,
    },
    orderBy: [desc(products.viewsCount)],
    limit,
  });

  return result as ProductWithCategory[];
}

/**
 * Increment product view count
 */
export async function incrementProductViews(productId: string): Promise<void> {
  await db
    .update(products)
    .set({
      viewsCount: sql`${products.viewsCount} + 1`,
    })
    .where(eq(products.id, productId));
}

/**
 * Get a single product by ID or slug with its lots
 */
export async function getProductWithLots(
  idOrSlug: string
): Promise<ProductWithCategoryAndLots | null> {
  // Try to find by ID first, then by slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const whereClause = isUuid
    ? and(eq(products.id, idOrSlug), eq(products.isActive, true))
    : and(eq(products.slug, idOrSlug), eq(products.isActive, true));

  const result = await db.query.products.findFirst({
    where: whereClause,
    with: {
      category: true,
      lots: {
        where: eq(productLots.isAvailable, true),
        orderBy: [asc(productLots.sortOrder)],
      },
    },
  });

  return result as ProductWithCategoryAndLots | null;
}

/**
 * Get multiple products by IDs (for cart/checkout)
 */
export async function getProductsByIds(
  ids: string[]
): Promise<ProductWithCategory[]> {
  if (ids.length === 0) return [];

  const result = await db.query.products.findMany({
    where: inArray(products.id, ids),
    with: {
      category: true,
    },
  });

  return result as ProductWithCategory[];
}

/**
 * Get product lots by IDs
 */
export async function getLotsByIds(
  lotIds: string[]
): Promise<ProductLot[]> {
  if (lotIds.length === 0) return [];

  const result = await db
    .select()
    .from(productLots)
    .where(inArray(productLots.id, lotIds));

  return result;
}
