"use server";

import { eq } from "drizzle-orm";
import { db, orders } from "@/shared/lib/db";
import { normalizePhone } from "@/shared/lib/phone";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { toAccountOrderDetail } from "@/features/account/server/mappers";
import type { AccountOrderDetail } from "@/features/account/types";
import { TRACKING_RATE_LIMIT } from "../constants";
import { trackOrderSchema } from "../schemas";

export type TrackOrderResult =
  | { ok: true; order: AccountOrderDetail; firstName: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function trackOrder(input: unknown): Promise<TrackOrderResult> {
  const parsed = trackOrderSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
      const key = String(issue.path[0]);
      acc[key] = [...(acc[key] ?? []), issue.message];
      return acc;
    }, {});
    return { ok: false, error: "Vérifiez les informations saisies", fieldErrors };
  }

  const ip = await getClientIp();
  if (!consumeRateLimit(`track:${ip}`, TRACKING_RATE_LIMIT)) {
    return { ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, parsed.data.orderNumber),
    with: { items: true },
  });
  const phone = normalizePhone(parsed.data.phone);
  if (!order || !phone || normalizePhone(order.customerPhone) !== phone) {
    return { ok: false, error: "Aucune commande ne correspond à ce numéro et à ce téléphone." };
  }

  return { ok: true, order: toAccountOrderDetail(order), firstName: order.customerFirstName };
}
