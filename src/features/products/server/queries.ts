import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, productLots, products } from "@/shared/lib/db";
import { sanitizeRichText } from "@/shared/lib/sanitize";
import { assertAdmin } from "@/features/auth/server/session";
import { PRODUCTS_CACHE_TAG } from "../constants";
import { toAdminProduct, toProductSummary, toShopProduct } from "./mappers";

const CACHE_OPTIONS = { revalidate: 120, tags: [PRODUCTS_CACHE_TAG] };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const summaryRelations = () => ({
  category: true as const,
  lots: {
    where: eq(productLots.isAvailable, true),
    orderBy: [asc(productLots.sortOrder)],
  },
});

export const getShopProducts = unstable_cache(
  async () => {
    const rows = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: summaryRelations(),
      orderBy: [desc(products.createdAt)],
    });
    return rows.map(toShopProduct);
  },
  ["shop-products"],
  CACHE_OPTIONS
);

export const getNewArrivals = unstable_cache(
  async (limit: number) => {
    const rows = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: summaryRelations(),
      orderBy: [desc(products.isNew), desc(products.createdAt)],
      limit,
    });
    return rows.map(toProductSummary);
  },
  ["new-arrivals"],
  CACHE_OPTIONS
);

export const getBestsellers = unstable_cache(
  async (limit: number) => {
    const rows = await db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isBestseller, true)),
      with: summaryRelations(),
      orderBy: [desc(products.viewsCount), asc(products.sortOrder)],
      limit,
    });
    return rows.map(toProductSummary);
  },
  ["bestsellers"],
  CACHE_OPTIONS
);

export const getProductDetail = cache(async (idOrSlug: string) => {
  const identifier = UUID_PATTERN.test(idOrSlug) ? eq(products.id, idOrSlug) : eq(products.slug, idOrSlug);
  const product = await db.query.products.findFirst({
    where: and(identifier, eq(products.isActive, true)),
    with: summaryRelations(),
  });
  return product ? { ...product, description: sanitizeRichText(product.description) } : null;
});

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  if (!categoryId) return [];
  const rows = await db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.categoryId, categoryId), ne(products.id, productId)),
    with: summaryRelations(),
    orderBy: [desc(products.viewsCount)],
    limit,
  });
  return rows.map(toProductSummary);
}

export async function getActiveProductSlugs() {
  return db.select({ slug: products.slug }).from(products).where(eq(products.isActive, true));
}

export async function getAdminProducts() {
  await assertAdmin();
  const rows = await db.query.products.findMany({
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  });
  return rows.map(toAdminProduct);
}

export async function getAdminProduct(id: string) {
  await assertAdmin();
  if (!UUID_PATTERN.test(id)) return null;
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });
  return row ? toAdminProduct(row) : null;
}
