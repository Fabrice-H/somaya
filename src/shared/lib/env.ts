import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables d'environnement manquantes ou invalides : ${missing}`);
  }
  cached = parsed.data;
  return cached;
}
