import "server-only";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db, heroBanner } from "@/shared/lib/db";
import { getActiveCategories } from "@/features/categories/server/queries";
import { getBestsellers, getNewArrivals } from "@/features/products/server/queries";
import { getActiveTestimonials } from "@/features/testimonials/server/queries";
import { HERO_BANNER_ID, HERO_CACHE_TAG, HOME_LIMITS } from "../constants";
import type { HeroBannerContent } from "../types";

export const getHeroBannerContent = unstable_cache(
  async (): Promise<HeroBannerContent | null> => {
    const hero = await db.query.heroBanner.findFirst({ where: eq(heroBanner.id, HERO_BANNER_ID) });
    if (!hero?.isActive) return null;
    return {
      id: hero.id,
      layout: hero.layout,
      eyebrow: hero.eyebrow,
      title: hero.title,
      title_highlight: hero.titleHighlight,
      title_suffix: hero.titleSuffix,
      description: hero.description,
      button_text: hero.buttonText,
      button_link: hero.buttonLink,
      media_type: hero.mediaType,
      media_url: hero.mediaUrl,
      media_position: hero.mediaPosition,
    };
  },
  ["hero-banner-content"],
  { revalidate: 120, tags: [HERO_CACHE_TAG] }
);

export async function getHomePageData() {
  const [heroBanner, categories, newArrivals, bestsellers, testimonials] = await Promise.all([
    getHeroBannerContent(),
    getActiveCategories(),
    getNewArrivals(HOME_LIMITS.newArrivals),
    getBestsellers(HOME_LIMITS.bestsellers),
    getActiveTestimonials(HOME_LIMITS.testimonials),
  ]);
  return { heroBanner, categories: categories.slice(0, HOME_LIMITS.categories), newArrivals, bestsellers, testimonials };
}
