import "server-only";
import { z } from "zod";
import { JEKO_DEFAULT_API_BASE } from "../constants";
import type { PaymentProviderId } from "../types";

const jekoSchema = z.object({
  apiKey: z.string().min(10),
  apiKeyId: z.string().min(1),
  storeId: z.string().min(1),
  webhookSecret: z.string().min(16),
  apiBase: z.string().url(),
});

export type JekoConfig = z.infer<typeof jekoSchema>;

const isProduction = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production";

export function getJekoConfig(): JekoConfig | null {
  const parsed = jekoSchema.safeParse({
    apiKey: process.env.JEKO_API_KEY ?? (isProduction ? process.env.JEKO_KEY_PROD : process.env.JEKO_KEY_DEV),
    apiKeyId: process.env.JEKO_API_KEY_ID,
    storeId: process.env.JEKO_STORE_ID,
    webhookSecret: process.env.JEKO_WEBHOOK_SECRET,
    apiBase: process.env.JEKO_API_BASE ?? JEKO_DEFAULT_API_BASE,
  });
  return parsed.success ? parsed.data : null;
}

export function getConfiguredProviderId(): PaymentProviderId | null {
  const requested = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (requested === "fake") return process.env.NODE_ENV === "production" && isProduction ? null : "fake";
  if (requested === "jeko") return getJekoConfig() ? "jeko" : null;
  return null;
}

export function getPublicSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
