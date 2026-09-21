import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, eq, sql } from "drizzle-orm";
import { categories, db, products } from "@/shared/lib/db";
import { CONTACT_DEFAULTS } from "@/shared/config/site";
import { CATEGORIES_CACHE_TAG } from "@/features/categories/constants";
import { PRODUCTS_CACHE_TAG } from "@/features/products/constants";
import { SETTINGS_CACHE_TAG } from "../constants";
import type { StoreContact } from "../types";

const withoutAt = (handle: string) => handle.replace(/^@/, "");

export const getStoreContact = unstable_cache(
  async (): Promise<StoreContact> => {
    const settings = await db.query.storeSettings.findFirst();
    return {
      phone: settings?.phoneNumber || CONTACT_DEFAULTS.phone,
      whatsapp: settings?.whatsappNumber || CONTACT_DEFAULTS.whatsapp,
      email: settings?.email || null,
      address: settings?.address || CONTACT_DEFAULTS.address,
      hours: settings?.deliveryHours || CONTACT_DEFAULTS.hours,
      instagram: withoutAt(settings?.instagramHandle || CONTACT_DEFAULTS.instagram),
      facebook: settings?.facebookUrl || CONTACT_DEFAULTS.facebook,
      tiktok: withoutAt(settings?.tiktokHandle || CONTACT_DEFAULTS.tiktok),
    };
  },
  ["store-contact"],
  { revalidate: 300, tags: [SETTINGS_CACHE_TAG] }
);

export const getDeliveryFee = unstable_cache(
  async () => {
    const settings = await db.query.storeSettings.findFirst({ columns: { deliveryFee: true } });
    return Number(settings?.deliveryFee ?? 0);
  },
  ["delivery-fee"],
  { revalidate: 300, tags: [SETTINGS_CACHE_TAG] }
);

export const getFooterCategories = unstable_cache(
  async () => {
    const rows = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .innerJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
      .where(eq(categories.isActive, true))
      .groupBy(categories.id, categories.name, categories.slug, categories.position)
      .having(sql`count(${products.id}) > 0`)
      .orderBy(asc(categories.position));
    return rows.map((category) => ({ ...category, name: category.name.trim() }));
  },
  ["footer-categories"],
  { revalidate: 300, tags: [CATEGORIES_CACHE_TAG, PRODUCTS_CACHE_TAG] }
);
