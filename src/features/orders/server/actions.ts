"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db, orders } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { refreshCustomerStats } from "@/features/customers/server/service";
import { ORDERS_CACHE_TAG } from "../constants";
import { updateOrderStatusSchema } from "../schemas";
import type { OrderActionResult } from "../types";

export async function updateOrderStatus(input: unknown): Promise<OrderActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  const parsed = updateOrderStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Statut invalide" };

  const { id, status } = parsed.data;
  const now = new Date();

  try {
    const updated = await db
      .update(orders)
      .set({ status, updatedAt: now, ...(status === "delivered" && { deliveredAt: now }) })
      .where(eq(orders.id, id))
      .returning({ id: orders.id, customerId: orders.customerId });

    if (updated.length === 0) return { ok: false, error: "Commande introuvable" };
    if (updated[0].customerId) {
      await refreshCustomerStats(updated[0].customerId).catch((error: unknown) =>
        console.error("refreshCustomerStats failed", error)
      );
    }
  } catch (error) {
    console.error("updateOrderStatus failed", error);
    return { ok: false, error: "Erreur lors de la mise à jour" };
  }

  updateTag(ORDERS_CACHE_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true };
}
