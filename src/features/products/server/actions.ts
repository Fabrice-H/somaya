"use server";

import { after } from "next/server";
import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, products } from "@/shared/lib/db";
import type { NewProduct } from "@/shared/lib/db/schema";
import { sanitizeRichText } from "@/shared/lib/sanitize";
import { generateSlug } from "@/shared/lib/utils";
import { requireAdmin } from "@/features/auth/server/session";
import { deleteImage } from "@/features/media/server/actions";
import { ADMIN_PRODUCTS_PATH, PRODUCTS_CACHE_TAG } from "../constants";
import { productIdSchema, productSchema, productUpdateSchema } from "../schemas";
import type { ProductActionResult, ProductInput } from "../types";

const UNAUTHORIZED: ProductActionResult = { success: false, error: "Non autorisé" };
const NOT_FOUND: ProductActionResult = { success: false, error: "Produit non trouvé" };

type ProductValues = z.output<typeof productUpdateSchema>;

function keepSentFields(values: ProductValues, input: object): ProductValues {
  return Object.fromEntries(Object.entries(values).filter(([key]) => key in input)) as ProductValues;
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  for (let attempt = 1; ; attempt++) {
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      columns: { id: true },
    });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}${attempt.toString(36)}`;
  }
}

function toColumns(data: ProductValues): Partial<NewProduct> {
  const columns: Partial<NewProduct> = {
    name: data.name,
    description: data.description === undefined ? undefined : sanitizeRichText(data.description),
    price: data.price === undefined ? undefined : String(data.price),
    oldPrice: data.old_price === undefined ? undefined : data.old_price ? String(data.old_price) : null,
    categoryId: data.category_id === undefined ? undefined : data.category_id || null,
    images: data.images,
    colors: data.colors,
    sizes: data.sizes,
    material: data.material === undefined ? undefined : data.material || null,
    stock: data.stock,
    lowStockThreshold: data.low_stock_threshold,
    sku: data.sku === undefined ? undefined : data.sku || null,
    isActive: data.is_active,
    isFeatured: data.is_featured,
    isNew: data.is_new,
    isBestseller: data.is_bestseller,
    sortOrder: data.sort_order,
  };
  return Object.fromEntries(Object.entries(columns).filter(([, value]) => value !== undefined));
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Error && error.message.includes("unique constraint");
}

function revalidateProducts(id?: string) {
  revalidatePath(ADMIN_PRODUCTS_PATH);
  if (id) revalidatePath(`${ADMIN_PRODUCTS_PATH}/${id}`);
  updateTag(PRODUCTS_CACHE_TAG);
}

export async function createProduct(input: ProductInput): Promise<ProductActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const slug = await generateUniqueSlug(parsed.data.name);
    const [created] = await db
      .insert(products)
      .values({ ...toColumns(parsed.data), name: parsed.data.name, price: String(parsed.data.price), slug })
      .returning({ id: products.id });

    revalidateProducts();
    return { success: true, id: created.id };
  } catch (error) {
    console.error("createProduct failed:", error);
    return { success: false, error: isUniqueViolation(error) ? "Ce slug existe déjà" : "Erreur lors de la création" };
  }
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<ProductActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsedId = productIdSchema.safeParse(id);
  if (!parsedId.success) return NOT_FOUND;
  const parsed = productUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const sentFields = keepSentFields(parsed.data, input);

  try {
    const current = await db.query.products.findFirst({
      where: eq(products.id, parsedId.data),
      columns: { name: true },
    });
    if (!current) return NOT_FOUND;

    const { name } = sentFields;
    const slug = name && name !== current.name ? await generateUniqueSlug(name, parsedId.data) : undefined;

    await db
      .update(products)
      .set({ ...toColumns(sentFields), ...(slug && { slug }), updatedAt: new Date() })
      .where(eq(products.id, parsedId.data));

    revalidateProducts(parsedId.data);
    return { success: true };
  } catch (error) {
    console.error("updateProduct failed:", error);
    return {
      success: false,
      error: isUniqueViolation(error) ? "Ce slug existe déjà" : "Erreur lors de la mise à jour",
    };
  }
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsedId = productIdSchema.safeParse(id);
  if (!parsedId.success) return NOT_FOUND;

  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, parsedId.data),
      columns: { images: true },
      with: { lots: { columns: { images: true } } },
    });
    if (!product) return NOT_FOUND;

    await db.delete(products).where(eq(products.id, parsedId.data));

    const images = [...(product.images ?? []), ...product.lots.flatMap((lot) => lot.images ?? [])];
    if (images.length > 0) {
      after(() => Promise.allSettled(images.map((url) => deleteImage(url))));
    }

    revalidateProducts();
    return { success: true };
  } catch (error) {
    console.error("deleteProduct failed:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
