import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  apiKey: z.string().startsWith("sk_live_"),
  secret: z.string().min(16),
});

export type VendiaConfig = z.infer<typeof schema>;

export function getVendiaConfig(): VendiaConfig | null {
  const parsed = schema.safeParse({
    url: process.env.VENDIA_WEBHOOK_URL?.trim(),
    apiKey: process.env.VENDIA_API_KEY?.trim(),
    secret: process.env.VENDIA_WEBHOOK_SECRET?.trim(),
  });
  return parsed.success ? parsed.data : null;
}
