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

const stage = process.env.APP_STAGE?.trim().toLowerCase() === "prod" ? "prod" : isProduction ? "prod" : "dev";

function envByStage(name: string, aliases: string[] = []): string | undefined {
  const suffix = stage === "prod" ? "_PROD" : "_DEV";
  const candidates = [name, ...aliases].flatMap((base) => [`${base}${suffix}`, base]);
  for (const key of candidates) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getJekoConfig(): JekoConfig | null {
  const parsed = jekoSchema.safeParse({
    apiKey: envByStage("JEKO_API_KEY", ["JEKO_KEY"]),
    apiKeyId: envByStage("JEKO_API_KEY_ID"),
    storeId: envByStage("JEKO_STORE_ID"),
    webhookSecret: envByStage("JEKO_WEBHOOK_SECRET"),
    apiBase: envByStage("JEKO_API_BASE") ?? JEKO_DEFAULT_API_BASE,
  });
  return parsed.success ? parsed.data : null;
}

export function getConfiguredProviderId(): PaymentProviderId | null {
  const requested = envByStage("PAYMENT_PROVIDER")?.toLowerCase();
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
