import "server-only";
import { serverEnv } from "@/shared/lib/env";

const GUEST_TOKEN_TTL_MS = 5 * 60 * 1000;
const encoder = new TextEncoder();

async function sign(phone: string, expiresAt: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(serverEnv().AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`guest:${phone}:${expiresAt}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createGuestToken(phone: string): Promise<string> {
  const expiresAt = Date.now() + GUEST_TOKEN_TTL_MS;
  return `${expiresAt}.${await sign(phone, expiresAt)}`;
}

export async function verifyGuestToken(phone: string, token: string): Promise<boolean> {
  const [expiresRaw, signature] = token.split(".");
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) return false;
  const expected = await sign(phone, expiresAt);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
