"use server";

import { db, priceLots, categories } from "@/lib/db";
import { eq, desc, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";
import { priceLotSchema, priceLotUpdateSchema } from "./schemas";
import { deleteImage } from "@/features/admin/storage/actions";
import type { PriceLot, PriceLotInput, PriceLotItem } from "./types";
import type { PriceLot as DbPriceLot, Category } from "@/lib/db/schema";

// Helper to convert DB lot to admin format
function toAdminPriceLot(
  lot: DbPriceLot,
  category?: Category | null
): PriceLot {
  const items = (lot.items as PriceLotItem[]) || [];
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  return {
    id: lot.id,
    name: lot.name,
    price: Number(lot.price),
    category_id: lot.categoryId,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
    items,
    is_active: lot.isActive,
    sort_order: lot.sortOrder,
    created_at: lot.createdAt.toISOString(),
    updated_at: lot.updatedAt.toISOString(),
    total_items: items.length,
    total_stock: totalStock,
  };
}

// Get all price lots
export async function getPriceLots(): Promise<PriceLot[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  try {
    const result = await db.query.priceLots.findMany({
      with: {
        category: true,
      },
      orderBy: [asc(priceLots.sortOrder), desc(priceLots.createdAt)],
    });

    return result.map((lot) => toAdminPriceLot(lot, lot.category));
  } catch (error) {
    console.error("Error fetching price lots:", error);
    return [];
  }
}

// Get single price lot
export async function getPriceLot(id: string): Promise<PriceLot | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    const result = await db.query.priceLots.findFirst({
      where: eq(priceLots.id, id),
      with: {
        category: true,
      },
    });

    if (!result) return null;
    return toAdminPriceLot(result, result.category);
  } catch (error) {
    console.error("Error fetching price lot:", error);
    return null;
  }
}

// Create price lot
export async function createPriceLot(
  input: PriceLotInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = priceLotSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [result] = await db
      .insert(priceLots)
      .values({
        name: parsed.data.name,
        price: String(parsed.data.price),
        categoryId: parsed.data.category_id || null,
        items: parsed.data.items,
        isActive: parsed.data.is_active,
        sortOrder: parsed.data.sort_order,
      })
      .returning({ id: priceLots.id });

    revalidatePath("/admin/lots");
    revalidatePath("/lots");

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating price lot:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

// Update price lot
export async function updatePriceLot(
  id: string,
  input: Partial<PriceLotInput>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.price !== undefined) updateData.price = String(input.price);
    if (input.category_id !== undefined) updateData.categoryId = input.category_id;
    if (input.items !== undefined) updateData.items = input.items;
    if (input.is_active !== undefined) updateData.isActive = input.is_active;
    if (input.sort_order !== undefined) updateData.sortOrder = input.sort_order;

    updateData.updatedAt = new Date();

    await db.update(priceLots).set(updateData).where(eq(priceLots.id, id));

    revalidatePath("/admin/lots");
    revalidatePath(`/admin/lots/${id}`);
    revalidatePath("/lots");

    return { success: true };
  } catch (error) {
    console.error("Error updating price lot:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

// Delete price lot
export async function deletePriceLot(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // Get the lot to retrieve its images
    const lot = await db.query.priceLots.findFirst({
      where: eq(priceLots.id, id),
    });

    if (!lot) {
      return { success: false, error: "Lot non trouvé" };
    }

    // Delete the lot from the database
    await db.delete(priceLots).where(eq(priceLots.id, id));

    // Delete images from Cloudinary (fire and forget)
    const items = (lot.items as PriceLotItem[]) || [];
    const images = items.map((item) => item.image);
    if (images.length > 0) {
      Promise.allSettled(images.map((url) => deleteImage(url))).catch(() => {});
    }

    revalidatePath("/admin/lots");
    revalidatePath("/lots");

    return { success: true };
  } catch (error) {
    console.error("Error deleting price lot:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Toggle price lot active status
export async function togglePriceLotActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(priceLots)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(priceLots.id, id));

    revalidatePath("/admin/lots");
    revalidatePath("/lots");

    return { success: true };
  } catch (error) {
    console.error("Error toggling price lot:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

// Get all categories for dropdown
export async function getCategories(): Promise<
  Array<{ id: string; name: string; slug: string }>
> {
  try {
    const result = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.name)],
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
