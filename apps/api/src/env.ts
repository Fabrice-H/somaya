import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().url(),
  CRON_SECRET: z.string().min(16),
  SITE_URL: z.string().url(),
});

export type ApiEnv = z.infer<typeof schema>;

let cached: ApiEnv | null = null;

export function loadEnv(): ApiEnv {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables d'environnement manquantes ou invalides : ${missing}`);
  }
  cached = parsed.data;
  return cached;
}
