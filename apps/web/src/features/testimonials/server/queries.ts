import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, testimonials } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { TESTIMONIALS_CACHE_TAG } from "../constants";
import { toTestimonialData } from "./mappers";
import type { TestimonialCard, TestimonialData } from "../types";

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

export async function getTestimonials(): Promise<TestimonialData[]> {
  await assertAdmin();
  const rows = await db.query.testimonials.findMany({ orderBy: [asc(testimonials.sortOrder)] });
  return rows.map(toTestimonialData);
}
