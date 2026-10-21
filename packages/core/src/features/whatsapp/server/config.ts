import { z } from "zod";
import { WHATSAPP_API_VERSION, WHATSAPP_GRAPH_BASE } from "../constants";

const schema = z.object({
  phoneNumberId: z.string().min(5),
  accessToken: z.string().min(20),
  appSecret: z.string().min(10),
  verifyToken: z.string().min(8),
  apiBase: z.string().url(),
});

export type WhatsappConfig = z.infer<typeof schema>;

export function getWhatsappConfig(): WhatsappConfig | null {
  const parsed = schema.safeParse({
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    appSecret: process.env.WHATSAPP_APP_SECRET,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    apiBase: `${WHATSAPP_GRAPH_BASE}/${process.env.WHATSAPP_API_VERSION ?? WHATSAPP_API_VERSION}`,
  });
  return parsed.success ? parsed.data : null;
}

export function getWebhookSecrets(): { appSecret: string; verifyToken: string } | null {
  const appSecret = process.env.WHATSAPP_APP_SECRET?.trim();
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN?.trim();
  return appSecret && verifyToken ? { appSecret, verifyToken } : null;
}
