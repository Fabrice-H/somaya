"use server";

import { eq } from "drizzle-orm";
import { after } from "next/server";
import { revalidatePath, updateTag } from "next/cache";
import { db, priceLots } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { deleteImage } from "@/features/media/server/actions";
import { ADMIN_LOTS_PATH, PRICE_LOTS_CACHE_TAG, PRICE_LOTS_REVALIDATE_PATHS } from "../constants";
import { priceLotSchema, priceLotUpdateSchema } from "../schemas";
import { toLotItems } from "./mappers";
import type { PriceLotActionResult, PriceLotInput } from "../types";

const UNAUTHORIZED: PriceLotActionResult = { success: false, error: "Non autorisé" };

function revalidatePriceLots(id?: string) {
  PRICE_LOTS_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  if (id) revalidatePath(`${ADMIN_LOTS_PATH}/${id}`);
  updateTag(PRICE_LOTS_CACHE_TAG);
}

export async function createPriceLot(input: PriceLotInput): Promise<PriceLotActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = priceLotSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, price, category_id, items, is_active, sort_order } = parsed.data;

  try {
    const [row] = await db
      .insert(priceLots)
      .values({
        name,
        price: String(price),
        categoryId: category_id || null,
        items,
        isActive: is_active,
        sortOrder: sort_order ?? 0,
      })
      .returning({ id: priceLots.id });

    revalidatePriceLots();
    return { success: true, id: row.id };
  } catch (error) {
    console.error("createPriceLot failed:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updatePriceLot(id: string, input: Partial<PriceLotInput>): Promise<PriceLotActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = priceLotUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, price, category_id, items, is_active, sort_order } = parsed.data;

  try {
    await db
      .update(priceLots)
      .set({
        name,
        price: price === undefined ? undefined : String(price),
        categoryId: category_id === undefined ? undefined : category_id || null,
        items,
        isActive: is_active,
        sortOrder: sort_order,
        updatedAt: new Date(),
      })
      .where(eq(priceLots.id, id));

    revalidatePriceLots(id);
    return { success: true };
  } catch (error) {
    console.error("updatePriceLot failed:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deletePriceLot(id: string): Promise<PriceLotActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const [row] = await db.delete(priceLots).where(eq(priceLots.id, id)).returning({ items: priceLots.items });
    if (!row) return { success: false, error: "Lot non trouvé" };

    const images = toLotItems(row.items)
      .map((item) => item.image)
      .filter(Boolean);
    if (images.length > 0) after(() => Promise.allSettled(images.map((url) => deleteImage(url))));

    revalidatePriceLots();
    return { success: true };
  } catch (error) {
    console.error("deletePriceLot failed:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function togglePriceLotActive(id: string, isActive: boolean): Promise<PriceLotActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    await db.update(priceLots).set({ isActive, updatedAt: new Date() }).where(eq(priceLots.id, id));
    revalidatePriceLots();
    return { success: true };
  } catch (error) {
    console.error("togglePriceLotActive failed:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
