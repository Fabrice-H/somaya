"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { customers, db } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { CUSTOMERS_PATH } from "../constants";
import { updateCustomerNotesSchema } from "../schemas";
import type { CustomerActionResult } from "../types";

export async function updateCustomerNotes(input: unknown): Promise<CustomerActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  const parsed = updateCustomerNotesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Note invalide" };

  try {
    const updated = await db
      .update(customers)
      .set({ notes: parsed.data.notes || null, updatedAt: new Date() })
      .where(eq(customers.id, parsed.data.id))
      .returning({ id: customers.id });
    if (updated.length === 0) return { ok: false, error: "Client introuvable" };
  } catch (error) {
    console.error("updateCustomerNotes failed", error);
    return { ok: false, error: "Erreur lors de l'enregistrement" };
  }

  revalidatePath(`${CUSTOMERS_PATH}/${parsed.data.id}`);
  return { ok: true };
}
