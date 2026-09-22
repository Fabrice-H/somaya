"use server";

import { revalidatePath, updateTag } from "next/cache";
import { db, loyaltySettings } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { CUSTOMERS_PATH } from "@/features/customers/constants";
import { emitEvent } from "@/features/events/server/events";
import { LOYALTY_CACHE_TAG, LOYALTY_PATH, LOYALTY_REASONS, LOYALTY_SETTINGS_ID } from "../constants";
import { adjustPointsSchema, loyaltySettingsSchema } from "../schemas";
import type { LoyaltyActionResult } from "../types";
import {
  adjustCustomerLoyalty,
  creditDeliveredOrder,
  listDeliveredOrdersWithoutPoints,
  recomputeAllLoyaltyLevels,
} from "./service";

export async function updateLoyaltySettings(input: unknown): Promise<LoyaltyActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  const parsed = loyaltySettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Réglages invalides" };

  const values = {
    isEnabled: parsed.data.isEnabled,
    pointsPerStep: parsed.data.pointsPerStep,
    amountStep: parsed.data.amountStep,
    levels: parsed.data.levels,
    segmentRules: parsed.data.segmentRules,
    updatedAt: new Date(),
  };

  try {
    await db
      .insert(loyaltySettings)
      .values({ id: LOYALTY_SETTINGS_ID, ...values })
      .onConflictDoUpdate({ target: loyaltySettings.id, set: values });
    await recomputeAllLoyaltyLevels();
  } catch (error) {
    console.error("updateLoyaltySettings failed", error);
    return { ok: false, error: "Erreur lors de l'enregistrement" };
  }

  updateTag(LOYALTY_CACHE_TAG);
  revalidatePath(LOYALTY_PATH);
  revalidatePath(CUSTOMERS_PATH, "layout");
  return { ok: true, message: "Réglages enregistrés" };
}

export async function adjustCustomerPoints(input: unknown): Promise<LoyaltyActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  const parsed = adjustPointsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Ajustement invalide" };

  try {
    const { points } = await adjustCustomerLoyalty({ ...parsed.data, actorEmail: admin.email });
    if (parsed.data.points > 0) {
      await emitEvent({
        type: "loyalty.points_added",
        customerId: parsed.data.customerId,
        orderId: null,
        points: parsed.data.points,
      });
    }
    revalidatePath(`${CUSTOMERS_PATH}/${parsed.data.customerId}`);
    revalidatePath(LOYALTY_PATH);
    return { ok: true, message: `Solde : ${points} point${points > 1 ? "s" : ""}` };
  } catch (error) {
    console.error("adjustCustomerPoints failed", error);
    return { ok: false, error: "Erreur lors de l'ajustement" };
  }
}

export async function backfillDeliveredOrders(): Promise<LoyaltyActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  try {
    const orderIds = await listDeliveredOrdersWithoutPoints();
    let credited = 0;
    let points = 0;
    for (const orderId of orderIds) {
      const result = await creditDeliveredOrder(orderId, LOYALTY_REASONS.backfill);
      if (!result.credited || !result.customerId) continue;
      credited += 1;
      points += result.points;
      await emitEvent({ type: "loyalty.points_added", customerId: result.customerId, orderId, points: result.points });
    }
    revalidatePath(LOYALTY_PATH);
    revalidatePath(CUSTOMERS_PATH, "layout");
    return {
      ok: true,
      message:
        credited === 0
          ? "Aucune commande livrée à créditer"
          : `${credited} commande${credited > 1 ? "s" : ""} créditée${credited > 1 ? "s" : ""}, ${points} point${points > 1 ? "s" : ""} attribué${points > 1 ? "s" : ""}`,
    };
  } catch (error) {
    console.error("backfillDeliveredOrders failed", error);
    return { ok: false, error: "Erreur pendant le rattrapage" };
  }
}
