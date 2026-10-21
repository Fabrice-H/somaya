import "server-only";
import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db, priceLots } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { PRICE_LOTS_CACHE_TAG } from "../constants";
import { priceLotIdSchema } from "../schemas";
import { toAdminPriceLot, toLotItems } from "./mappers";
import type { PriceLot, PriceLotsCatalog, PublicPriceLot } from "../types";

export const getPriceLotsCatalog = unstable_cache(
  async (): Promise<PriceLotsCatalog> => {
    const rows = await db.query.priceLots.findMany({
      where: eq(priceLots.isActive, true),
      with: { category: true },
      orderBy: [asc(priceLots.sortOrder), asc(priceLots.price)],
    });

    const lots: PublicPriceLot[] = rows.map((lot) => ({
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      category: lot.category ? { id: lot.category.id, name: lot.category.name, slug: lot.category.slug } : null,
      items: toLotItems(lot.items),
    }));

    const categories = new Map(lots.flatMap((lot) => (lot.category ? [[lot.category.id, lot.category] as const] : [])));

    return {
      lots,
      availablePrices: [...new Set(lots.map((lot) => lot.price))].sort((a, b) => a - b),
      categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name)),
    };
  },
  ["price-lots-catalog"],
  { revalidate: 120, tags: [PRICE_LOTS_CACHE_TAG] }
);

export async function getPriceLots(): Promise<PriceLot[]> {
  await assertAdmin();
  const rows = await db.query.priceLots.findMany({
    with: { category: true },
    orderBy: [asc(priceLots.sortOrder), desc(priceLots.createdAt)],
  });
  return rows.map(toAdminPriceLot);
}

export async function getPriceLot(id: string): Promise<PriceLot | null> {
  await assertAdmin();
  if (!priceLotIdSchema.safeParse(id).success) return null;
  const row = await db.query.priceLots.findFirst({
    where: eq(priceLots.id, id),
    with: { category: true },
  });
  return row ? toAdminPriceLot(row) : null;
}
