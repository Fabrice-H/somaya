import "server-only";
import { headers } from "next/headers";

type RateLimitRule = { limit: number; windowMs: number };

const hits = new Map<string, number[]>();

export function consumeRateLimit(key: string, { limit, windowMs }: RateLimitRule): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function resetRateLimit(key: string) {
  hits.delete(key);
}

export async function getClientIp(): Promise<string> {
  const list = await headers();
  return list.get("x-real-ip") ?? list.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
