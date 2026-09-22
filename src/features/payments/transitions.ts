import { createHmac, timingSafeEqual } from "node:crypto";
import { PAYMENT_STATUS_ORDER } from "./constants";
import type { PaymentStatus } from "./types";

export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return false;
  if (from === "paid") return to === "refunded";
  if (from === "refunded") return false;
  if (from === "failed" || from === "cancelled") return to === "paid";
  return PAYMENT_STATUS_ORDER[to] > PAYMENT_STATUS_ORDER[from];
}

export function amountsMatch(expected: number, received: number | null): boolean {
  if (received === null) return true;
  return Math.round(expected) === Math.round(received);
}

export function hmacSha256Hex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload, "utf8").digest("hex");
}

export function verifyHmacSignature(secret: string, payload: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = Buffer.from(hmacSha256Hex(secret, payload), "utf8");
  const provided = Buffer.from(signature.trim().toLowerCase(), "utf8");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export function mapJekoStatus(status: string | undefined): PaymentStatus {
  switch (status) {
    case "success":
    case "completed":
      return "paid";
    case "error":
    case "failed":
      return "failed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    default:
      return "pending";
  }
}
