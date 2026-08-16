"use server";

import { db, productLots } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";
import type { ProductLot as DbProductLot } from "@/lib/db/schema";
import { productLotSchema } from "./schemas";
import { deleteImage } from "@/features/admin/storage/actions";
import type { ProductLot, ProductLotInput, LotItemData } from "./types";

// Helper to convert DB lot to admin format
function toAdminLot(lot: DbProductLot): ProductLot {
  // Handle migration: if items exists, use it; otherwise convert from legacy images/stock
  let items = (lot.items as LotItemData[]) || [];
  if (items.length === 0 && lot.images && lot.images.length > 0) {
    // Legacy migration: convert images to items
    items = lot.images.map((image, idx) => ({
      id: `legacy-${lot.id}-${idx}`,
      image,
      stock: Math.floor(lot.stock / (lot.images?.length || 1)),
      label: undefined,
    }));
  }

  return {
    id: lot.id,
    product_id: lot.productId,
    name: lot.name,
    price: Number(lot.price),
    items,
    images: lot.images || [], // Keep for backward compat
    stock: lot.stock, // Keep for backward compat
    is_available: lot.isAvailable,
    sort_order: lot.sortOrder,
    created_at: lot.createdAt.toISOString(),
    updated_at: lot.updatedAt.toISOString(),
  };
}

export async function getProductLots(productId: string): Promise<ProductLot[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  try {
    const result = await db.query.productLots.findMany({
      where: eq(productLots.productId, productId),
      orderBy: [asc(productLots.sortOrder)],
    });

    return result.map(toAdminLot);
  } catch (error) {
    console.error("Error fetching product lots:", error);
    return [];
  }
}

export async function getLot(id: string): Promise<ProductLot | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    const result = await db.query.productLots.findFirst({
      where: eq(productLots.id, id),
    });

    if (!result) return null;
    return toAdminLot(result);
  } catch (error) {
    console.error("Error fetching lot:", error);
    return null;
  }
}

export async function createLot(
  productId: string,
  input: ProductLotInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = productLotSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Calculate total stock from items
    const totalStock = parsed.data.items.reduce((sum, item) => sum + item.stock, 0);
    // Extract images from items for legacy compatibility
    const images = parsed.data.items.map((item) => item.image);

    const [result] = await db
      .insert(productLots)
      .values({
        productId,
        name: parsed.data.name,
        price: String(parsed.data.price),
        items: parsed.data.items,
        images, // Legacy compat
        stock: totalStock, // Legacy compat
        isAvailable: parsed.data.is_available,
        sortOrder: parsed.data.sort_order,
      })
      .returning({ id: productLots.id });

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating lot:", error);
    return { success: false, error: "Erreur lors de la création du lot" };
  }
}

export async function updateLot(
  id: string,
  input: Partial<ProductLotInput>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.price !== undefined) updateData.price = String(input.price);
    if (input.items !== undefined) {
      updateData.items = input.items;
      // Calculate legacy fields from items
      updateData.images = input.items.map((item) => item.image);
      updateData.stock = input.items.reduce((sum, item) => sum + item.stock, 0);
    }
    if (input.is_available !== undefined) updateData.isAvailable = input.is_available;
    if (input.sort_order !== undefined) updateData.sortOrder = input.sort_order;

    updateData.updatedAt = new Date();

    await db.update(productLots).set(updateData).where(eq(productLots.id, id));

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");

    return { success: true };
  } catch (error) {
    console.error("Error updating lot:", error);
    return { success: false, error: "Erreur lors de la mise à jour du lot" };
  }
}

export async function deleteLot(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const lot = await db.query.productLots.findFirst({
      where: eq(productLots.id, id),
    });

    if (!lot) {
      return { success: false, error: "Lot non trouvé" };
    }

    await db.delete(productLots).where(eq(productLots.id, id));

    // Delete images from Cloudinary (from items or legacy images)
    const items = (lot.items as LotItemData[]) || [];
    const images = items.length > 0
      ? items.map((item) => item.image)
      : lot.images || [];

    if (images.length > 0) {
      Promise.allSettled(images.map((url) => deleteImage(url))).catch((error) => {
        console.error("Error deleting lot images:", error);
      });
    }

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");

    return { success: true };
  } catch (error) {
    console.error("Error deleting lot:", error);
    return { success: false, error: "Erreur lors de la suppression du lot" };
  }
}

export async function saveLots(
  productId: string,
  lots: Array<ProductLotInput & { id?: string }>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // Get existing lots
    const existingLots = await db.query.productLots.findMany({
      where: eq(productLots.productId, productId),
    });

    const existingIds = new Set(existingLots.map((l) => l.id));
    const newIds = new Set(lots.filter((l) => l.id && !l.id.startsWith("temp-")).map((l) => l.id!));

    // Find lots to delete
    const toDelete = existingLots.filter((l) => !newIds.has(l.id));

    // Delete removed lots
    for (const lot of toDelete) {
      await db.delete(productLots).where(eq(productLots.id, lot.id));

      // Delete images from items or legacy images
      const items = (lot.items as LotItemData[]) || [];
      const images = items.length > 0
        ? items.map((item) => item.image)
        : lot.images || [];

      if (images.length > 0) {
        Promise.allSettled(images.map((url) => deleteImage(url))).catch(() => {});
      }
    }

    // Update or create lots
    for (let i = 0; i < lots.length; i++) {
      const lot = lots[i];
      const parsed = productLotSchema.safeParse({
        ...lot,
        sort_order: i,
      });

      if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
      }

      // Calculate legacy fields from items
      const totalStock = parsed.data.items.reduce((sum, item) => sum + item.stock, 0);
      const images = parsed.data.items.map((item) => item.image);

      const isExisting = lot.id && !lot.id.startsWith("temp-") && existingIds.has(lot.id);

      if (isExisting) {
        // Update existing lot
        await db
          .update(productLots)
          .set({
            name: parsed.data.name,
            price: String(parsed.data.price),
            items: parsed.data.items,
            images, // Legacy compat
            stock: totalStock, // Legacy compat
            isAvailable: parsed.data.is_available,
            sortOrder: parsed.data.sort_order,
            updatedAt: new Date(),
          })
          .where(eq(productLots.id, lot.id!));
      } else {
        // Create new lot
        await db.insert(productLots).values({
          productId,
          name: parsed.data.name,
          price: String(parsed.data.price),
          items: parsed.data.items,
          images, // Legacy compat
          stock: totalStock, // Legacy compat
          isAvailable: parsed.data.is_available,
          sortOrder: parsed.data.sort_order,
        });
      }
    }

    revalidatePath("/admin/produits");
    revalidatePath(`/admin/produits/${productId}`);
    revalidatePath("/catalogue");

    return { success: true };
  } catch (error) {
    console.error("Error saving lots:", error);
    return { success: false, error: "Erreur lors de la sauvegarde des lots" };
  }
}
