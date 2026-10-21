"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db, orders } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { refreshCustomerStats } from "@/features/customers/server/service";
import { ORDER_STATUS_EVENTS } from "@/features/events/constants";
import { emitEvent } from "@/features/events/server/events";
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

  const current = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { status: true, customerId: true, paymentMethod: true, paymentStatus: true },
  });
  if (!current) return { ok: false, error: "Commande introuvable" };
  if (current.status === status) return { ok: true, warnings: [] };

  try {
    await db
      .update(orders)
      .set({ status, updatedAt: now, ...(status === "delivered" && { deliveredAt: now }) })
      .where(eq(orders.id, id));
  } catch (error) {
    console.error("updateOrderStatus failed", error);
    return { ok: false, error: "Erreur lors de la mise à jour" };
  }

  if (current.customerId) {
    await refreshCustomerStats(current.customerId).catch((error: unknown) =>
      console.error("refreshCustomerStats failed", error)
    );
  }

  const { warnings } = await emitEvent({
    type: ORDER_STATUS_EVENTS[status],
    orderId: id,
    customerId: current.customerId,
    previousStatus: current.status,
  });

  if (current.paymentMethod === "online" && current.paymentStatus !== "paid" && status !== "cancelled") {
    warnings.unshift("Paiement en ligne non reçu pour cette commande : vérifiez le paiement avant de la traiter.");
  }

  updateTag(ORDERS_CACHE_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true, warnings };
}
