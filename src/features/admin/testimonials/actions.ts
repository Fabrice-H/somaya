"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db, testimonials } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import type { Testimonial } from "@/lib/db/schema";

export type TestimonialData = {
  id: string;
  name: string;
  location: string | null;
  image: string | null;
  text: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
};

function toTestimonialData(data: Testimonial): TestimonialData {
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    image: data.image,
    text: data.text,
    rating: data.rating,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
  };
}

/**
 * Get all testimonials for admin
 */
export async function getTestimonials(): Promise<TestimonialData[]> {
  const result = await db.query.testimonials.findMany({
    orderBy: [asc(testimonials.sortOrder)],
  });
  return result.map(toTestimonialData);
}

/**
 * Get active testimonials for public display
 */
export async function getActiveTestimonials(): Promise<TestimonialData[]> {
  const result = await db.query.testimonials.findMany({
    where: eq(testimonials.isActive, true),
    orderBy: [asc(testimonials.sortOrder)],
  });
  return result.map(toTestimonialData);
}

/**
 * Get single testimonial
 */
export async function getTestimonial(id: string): Promise<TestimonialData | null> {
  const result = await db.query.testimonials.findFirst({
    where: eq(testimonials.id, id),
  });
  if (!result) return null;
  return toTestimonialData(result);
}

/**
 * Create testimonial
 */
export async function createTestimonial(
  data: Omit<TestimonialData, "id">
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const [result] = await db
      .insert(testimonials)
      .values({
        name: data.name,
        location: data.location,
        image: data.image,
        text: data.text,
        rating: data.rating,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      })
      .returning({ id: testimonials.id });

    revalidatePath("/admin/temoignages");
    revalidateTag("testimonials", "max");

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

/**
 * Update testimonial
 */
export async function updateTestimonial(
  id: string,
  data: Partial<Omit<TestimonialData, "id">>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(testimonials)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id));

    revalidatePath("/admin/temoignages");
    revalidateTag("testimonials", "max");

    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));

    revalidatePath("/admin/temoignages");
    revalidateTag("testimonials", "max");

    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

/**
 * Reorder testimonials
 */
export async function reorderTestimonials(
  items: { id: string; sortOrder: number }[]
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    for (const item of items) {
      await db
        .update(testimonials)
        .set({ sortOrder: item.sortOrder })
        .where(eq(testimonials.id, item.id));
    }

    revalidatePath("/admin/temoignages");
    revalidateTag("testimonials", "max");

    return { success: true };
  } catch (error) {
    console.error("Error reordering testimonials:", error);
    return { success: false, error: "Erreur lors du réordonnancement" };
  }
}
