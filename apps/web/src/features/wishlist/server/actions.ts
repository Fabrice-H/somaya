"use server";

import { z } from "zod";
import { getProductsByIds } from "@/features/products/server/queries";
import type { ProductSummary } from "@/features/products/types";

const idsSchema = z.array(z.uuid()).max(100);

export type WishlistProductsResult = { products: ProductSummary[]; missingIds: string[] };

export async function fetchWishlistProducts(input: unknown): Promise<WishlistProductsResult> {
  const parsed = idsSchema.safeParse(input);
  if (!parsed.success) return { products: [], missingIds: [] };
  const ids = Array.from(new Set(parsed.data));
  const products = await getProductsByIds(ids);
  const found = new Set(products.map((product) => product.id));
  return { products, missingIds: ids.filter((id) => !found.has(id)) };
}
