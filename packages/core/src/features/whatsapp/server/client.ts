import { WHATSAPP_REQUEST_TIMEOUT_MS } from "../constants";
import { getWhatsappConfig, type WhatsappConfig } from "./config";

type SendResult = { ok: true; waMessageId: string } | { ok: false; error: string };

async function graph(config: WhatsappConfig, path: string, init: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WHATSAPP_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${config.apiBase}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${config.accessToken}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });
    const text = await response.text();
    const json: unknown = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const message = (json as { error?: { message?: string } } | null)?.error?.message ?? `HTTP ${response.status}`;
      throw new Error(message);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

async function send(payload: Record<string, unknown>): Promise<SendResult> {
  const config = getWhatsappConfig();
  if (!config) return { ok: false, error: "WhatsApp n'est pas configuré" };
  try {
    const data = (await graph(config, `/${config.phoneNumberId}/messages`, {
      method: "POST",
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", ...payload }),
    })) as { messages?: { id?: string }[] };
    const waMessageId = data.messages?.[0]?.id;
    return waMessageId ? { ok: true, waMessageId } : { ok: false, error: "Réponse inattendue de WhatsApp" };
  } catch (error) {
    console.error("whatsapp send failed", error);
    return { ok: false, error: error instanceof Error ? error.message : "Envoi impossible" };
  }
}

export const sendText = (to: string, body: string) => send({ to, type: "text", text: { body, preview_url: true } });

export const sendImage = (to: string, link: string, caption?: string) =>
  send({ to, type: "image", image: { link, ...(caption ? { caption } : {}) } });

export async function markAsRead(waMessageId: string): Promise<void> {
  const config = getWhatsappConfig();
  if (!config) return;
  try {
    await graph(config, `/${config.phoneNumberId}/messages`, {
      method: "POST",
      body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: waMessageId }),
    });
  } catch (error) {
    console.error("whatsapp markAsRead failed", error);
  }
}

export async function getMediaUrl(mediaId: string): Promise<string | null> {
  const config = getWhatsappConfig();
  if (!config) return null;
  try {
    const data = (await graph(config, `/${mediaId}`, { method: "GET" })) as { url?: string };
    return data.url ?? null;
  } catch (error) {
    console.error("whatsapp getMediaUrl failed", error);
    return null;
  }
}
