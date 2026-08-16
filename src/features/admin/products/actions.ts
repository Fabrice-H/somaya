"use server";

import { db, products } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";
import type { Product as DbProduct, Category } from "@/lib/db/schema";
import { productSchema, productUpdateSchema } from "./schemas";
import { deleteImage } from "@/features/admin/storage/actions";
import { generateSlug } from "@/lib/utils";

// Import types from types.ts (can't re-export from "use server" file)
import type { Product, ProductInput } from "./types";

// Helper to generate a unique slug
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await db.query.products.findFirst({
      where: excludeId
        ? eq(products.slug, slug)
        : eq(products.slug, slug),
      columns: { id: true },
    });

    // If no existing product with this slug, or it's the same product we're updating
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }

    // Generate a new slug with a unique suffix
    counter++;
    const uniqueSuffix = Date.now().toString(36).slice(-4) + counter.toString(36);
    slug = `${baseSlug}-${uniqueSuffix}`;
  }
}

// Helper to convert DB product to admin format
function toAdminProduct(
  product: DbProduct,
  category?: Category | null
): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    category_id: product.categoryId,
    images: product.images || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    material: product.material,
    stock: product.stock,
    low_stock_threshold: product.lowStockThreshold,
    sku: product.sku,
    is_active: product.isActive,
    is_featured: product.isFeatured,
    is_new: product.isNew,
    is_bestseller: product.isBestseller,
    sort_order: product.sortOrder,
    views_count: product.viewsCount,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
    category: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
  };
}

// Actions
export async function getProducts(): Promise<Product[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  try {
    const result = await db.query.products.findMany({
      with: {
        category: true,
      },
      orderBy: [desc(products.createdAt)],
    });

    return result.map((p) => toAdminProduct(p, p.category));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
      },
    });

    if (!result) return null;
    return toAdminProduct(result, result.category);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createProduct(
  input: ProductInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Generate unique slug from name (server-side, like ledetailparfait)
    const slug = await generateUniqueSlug(parsed.data.name);

    const [result] = await db
      .insert(products)
      .values({
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: String(parsed.data.price),
        oldPrice: parsed.data.old_price ? String(parsed.data.old_price) : null,
        categoryId: parsed.data.category_id || null,
        images: parsed.data.images,
        colors: parsed.data.colors,
        sizes: parsed.data.sizes,
        material: parsed.data.material || null,
        stock: parsed.data.stock,
        lowStockThreshold: parsed.data.low_stock_threshold,
        sku: parsed.data.sku || null,
        isActive: parsed.data.is_active,
        isFeatured: parsed.data.is_featured,
        isNew: parsed.data.is_new,
        isBestseller: parsed.data.is_bestseller,
        sortOrder: parsed.data.sort_order,
      })
      .returning({ id: products.id });

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true, id: result.id };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    if (
      error instanceof Error &&
      error.message.includes("unique constraint")
    ) {
      return { success: false, error: "Ce slug existe déjà" };
    }
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // Get current product to compare name for slug regeneration
    const currentProduct = await db.query.products.findFirst({
      where: eq(products.id, id),
      columns: { name: true, slug: true },
    });

    if (!currentProduct) {
      return { success: false, error: "Produit non trouvé" };
    }

    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.price !== undefined) updateData.price = String(input.price);
    if (input.old_price !== undefined)
      updateData.oldPrice = input.old_price ? String(input.old_price) : null;
    if (input.category_id !== undefined)
      updateData.categoryId = input.category_id;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.colors !== undefined) updateData.colors = input.colors;
    if (input.sizes !== undefined) updateData.sizes = input.sizes;
    if (input.material !== undefined) updateData.material = input.material;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.low_stock_threshold !== undefined)
      updateData.lowStockThreshold = input.low_stock_threshold;
    if (input.sku !== undefined) updateData.sku = input.sku;
    if (input.is_active !== undefined) updateData.isActive = input.is_active;
    if (input.is_featured !== undefined)
      updateData.isFeatured = input.is_featured;
    if (input.is_new !== undefined) updateData.isNew = input.is_new;
    if (input.is_bestseller !== undefined)
      updateData.isBestseller = input.is_bestseller;
    if (input.sort_order !== undefined) updateData.sortOrder = input.sort_order;

    // Regenerate slug if name changed (like ledetailparfait)
    if (input.name && input.name !== currentProduct.name) {
      updateData.slug = await generateUniqueSlug(input.name, id);
    }

    // Always update the updated_at timestamp
    updateData.updatedAt = new Date();

    await db.update(products).set(updateData).where(eq(products.id, id));

    revalidatePath("/admin/produits");
    revalidatePath(`/admin/produits/${id}`);
    revalidatePath("/catalogue");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    if (
      error instanceof Error &&
      error.message.includes("unique constraint")
    ) {
      return { success: false, error: "Ce slug existe déjà" };
    }
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // First, get the product to retrieve its images and lots
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        lots: true,
      },
    });

    if (!product) {
      return { success: false, error: "Produit non trouvé" };
    }

    // Delete the product from the database (lots will be cascade deleted)
    await db.delete(products).where(eq(products.id, id));

    // Delete product images from Cloudinary (fire and forget, don't block on errors)
    const images = product.images || [];
    if (images.length > 0) {
      Promise.allSettled(images.map((url) => deleteImage(url))).catch(
        (error) => {
          console.error("Error deleting product images:", error);
        }
      );
    }

    // Delete lot images from Cloudinary
    const lotImages = product.lots?.flatMap((lot) => lot.images || []) || [];
    if (lotImages.length > 0) {
      Promise.allSettled(lotImages.map((url) => deleteImage(url))).catch(
        (error) => {
          console.error("Error deleting lot images:", error);
        }
      );
    }

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(products)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(products.id, id));

    revalidatePath("/admin/produits");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true };
  } catch (error) {
    console.error("Error toggling product:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
