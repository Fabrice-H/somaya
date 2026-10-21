import { createHmac } from "node:crypto";
import { VENDIA_MAX_ATTEMPTS, VENDIA_RETRY_BASE_MS, VENDIA_RETRY_MAX_MS } from "./constants";

export function signVendiaBody(secret: string, timestamp: number, rawBody: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.`).update(rawBody).digest("hex");
}

export function buildVendiaHeaders(apiKey: string, secret: string, rawBody: string, now = Date.now()) {
  const timestamp = Math.floor(now / 1000);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "X-Timestamp": String(timestamp),
    "X-Signature": signVendiaBody(secret, timestamp, rawBody),
  };
}

export function retryDelayMs(attempts: number): number {
  return Math.min(VENDIA_RETRY_BASE_MS * 2 ** Math.max(0, attempts - 1), VENDIA_RETRY_MAX_MS);
}

export function isRetryable(status: number | null): boolean {
  if (status === null) return true;
  return status === 408 || status === 429 || status >= 500;
}

export function hasAttemptsLeft(attempts: number): boolean {
  return attempts < VENDIA_MAX_ATTEMPTS;
}
