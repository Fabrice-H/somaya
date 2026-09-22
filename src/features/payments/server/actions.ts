"use server";

import { eq } from "drizzle-orm";
import { db, orders, payments } from "@/shared/lib/db";
import { normalizePhone } from "@/shared/lib/phone";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { PAYMENT_RATE_LIMIT } from "../constants";
import type { StartPaymentResult } from "../types";
import { getConfiguredProviderId } from "./config";
import { recordFakeOutcome } from "./providers/fake";
import { applyProviderState, startPayment } from "./service";

const retrySchema = { orderNumber: /^SM-\d{8}-[A-Z0-9]{4}$/ };

export async function retryPaymentAction(input: { orderNumber: string; phone: string }): Promise<StartPaymentResult> {
  const orderNumber = String(input?.orderNumber ?? "").toUpperCase();
  const phone = normalizePhone(String(input?.phone ?? ""));
  if (!retrySchema.orderNumber.test(orderNumber) || !phone) return { ok: false, error: "Informations invalides" };

  const ip = await getClientIp();
  if (!consumeRateLimit(`payment-retry:${ip}`, PAYMENT_RATE_LIMIT)) {
    return { ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const order = await db.query.orders.findFirst({ where: eq(orders.orderNumber, orderNumber) });
  if (!order || normalizePhone(order.customerPhone) !== phone) return { ok: false, error: "Commande introuvable" };
  return startPayment(order.id);
}

export async function completeFakePaymentAction(input: { providerReference: string; outcome: "paid" | "failed" }) {
  if (getConfiguredProviderId() !== "fake") return { ok: false as const };
  const reference = String(input?.providerReference ?? "");
  const payment = await db.query.payments.findFirst({ where: eq(payments.providerReference, reference) });
  if (!payment) return { ok: false as const };
  const state = {
    status: input.outcome === "paid" ? ("paid" as const) : ("failed" as const),
    amount: Number(payment.amount),
    paymentMethod: "fake",
    failureReason: input.outcome === "failed" ? "payment_failed" : null,
    raw: { fake: true, outcome: input.outcome },
  };
  recordFakeOutcome(reference, state);
  await applyProviderState(payment, state);
  return { ok: true as const };
}
