"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { db, testimonials } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { ADMIN_SETTINGS_PATH, TESTIMONIALS_CACHE_TAG } from "../constants";
import { testimonialSchema, testimonialUpdateSchema } from "../schemas";
import type { TestimonialActionResult, TestimonialInput } from "../types";

const UNAUTHORIZED: TestimonialActionResult = { success: false, error: "Non autorisé" };

function revalidateTestimonials() {
  revalidatePath(ADMIN_SETTINGS_PATH);
  revalidateTag(TESTIMONIALS_CACHE_TAG, "max");
}

export async function createTestimonial(input: TestimonialInput): Promise<TestimonialActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const [row] = await db.insert(testimonials).values(parsed.data).returning({ id: testimonials.id });
    revalidateTestimonials();
    return { success: true, id: row.id };
  } catch (error) {
    console.error("createTestimonial failed:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>
): Promise<TestimonialActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = testimonialUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db
      .update(testimonials)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(testimonials.id, id));
    revalidateTestimonials();
    return { success: true };
  } catch (error) {
    console.error("updateTestimonial failed:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteTestimonial(id: string): Promise<TestimonialActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidateTestimonials();
    return { success: true };
  } catch (error) {
    console.error("deleteTestimonial failed:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
