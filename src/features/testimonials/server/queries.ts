import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, testimonials } from "@/shared/lib/db";
import { TESTIMONIALS_CACHE_TAG } from "../constants";
import type { TestimonialCard } from "../types";

export const getActiveTestimonials = unstable_cache(
  async (limit: number): Promise<TestimonialCard[]> => {
    const rows = await db.query.testimonials.findMany({
      where: eq(testimonials.isActive, true),
      orderBy: [asc(testimonials.sortOrder)],
      limit,
      columns: { id: true, name: true, location: true, image: true, text: true, rating: true },
    });
    return rows;
  },
  ["active-testimonials"],
  { revalidate: 120, tags: [TESTIMONIALS_CACHE_TAG] }
);
