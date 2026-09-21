import { unstable_cache } from "next/cache";
import { and, asc, eq, sql } from "drizzle-orm";
import { db, categories, products } from "@/lib/db";

export type FooterData = {
  categories: { id: string; name: string; slug: string }[];
  contact: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
  };
};

/**
 * Footer data - active categories that have at least one active product
 * + contact details from store settings. Cached 5 min, refreshed by admin edits.
 */
export const getFooterData = unstable_cache(
  async (): Promise<FooterData> => {
    const [categoryRows, settings] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
        .from(categories)
        .innerJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
        .where(eq(categories.isActive, true))
        .groupBy(categories.id, categories.name, categories.slug, categories.position)
        .having(sql`count(${products.id}) > 0`)
        .orderBy(asc(categories.position)),
      db.query.storeSettings.findFirst(),
    ]);

    return {
      categories: categoryRows.map((c) => ({ ...c, name: c.name.trim() })),
      contact: {
        phone: settings?.phoneNumber ?? null,
        whatsapp: settings?.whatsappNumber ?? null,
        email: settings?.email ?? null,
        instagram: settings?.instagramHandle ?? null,
        facebook: settings?.facebookUrl ?? null,
        tiktok: settings?.tiktokHandle ?? null,
      },
    };
  },
  ["footer-data"],
  { revalidate: 300, tags: ["store-settings", "categories", "products"] }
);
