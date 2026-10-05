import { createHmac, timingSafeEqual } from "node:crypto";
import type { InboundMessage, ParsedWebhook, StatusUpdate } from "./types";

export function verifyMetaSignature(appSecret: string, rawBody: string, header: string | null): boolean {
  const normalized = header?.trim().toLowerCase() ?? "";
  if (!normalized.startsWith("sha256=")) return false;
  const provided = Buffer.from(normalized.slice("sha256=".length), "utf8");
  const expected = Buffer.from(createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex"), "utf8");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export function verifyChallenge(
  query: URLSearchParams,
  verifyToken: string
): { ok: true; challenge: string } | { ok: false } {
  const mode = query.get("hub.mode");
  const token = query.get("hub.verify_token");
  const challenge = query.get("hub.challenge");
  if (mode !== "subscribe" || !token || !challenge || token !== verifyToken) return { ok: false };
  return { ok: true, challenge };
}

type RawMessage = {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  image?: { id?: string; caption?: string };
  video?: { id?: string; caption?: string };
  audio?: { id?: string };
  document?: { id?: string; caption?: string; filename?: string };
  sticker?: { id?: string };
  location?: { latitude?: number; longitude?: number; name?: string; address?: string };
  button?: { text?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
  reaction?: { emoji?: string };
};

type RawValue = {
  contacts?: { wa_id?: string; profile?: { name?: string } }[];
  messages?: RawMessage[];
  statuses?: { id?: string; status?: string; timestamp?: string }[];
};

const toDate = (timestamp: string | undefined) => {
  const seconds = Number(timestamp);
  return Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000) : new Date();
};

function bodyOf(message: RawMessage): string | null {
  switch (message.type) {
    case "text":
      return message.text?.body ?? null;
    case "image":
    case "video":
    case "document":
      return message[message.type]?.caption ?? null;
    case "button":
      return message.button?.text ?? null;
    case "interactive":
      return message.interactive?.button_reply?.title ?? message.interactive?.list_reply?.title ?? null;
    case "location":
      return [message.location?.name, message.location?.address].filter(Boolean).join(" · ") || "Position partagée";
    case "reaction":
      return message.reaction?.emoji ?? null;
    default:
      return null;
  }
}

function mediaIdOf(message: RawMessage): string | null {
  switch (message.type) {
    case "image":
    case "video":
    case "audio":
    case "document":
    case "sticker":
      return message[message.type]?.id ?? null;
    default:
      return null;
  }
}

export function parseWebhookPayload(payload: unknown): ParsedWebhook {
  const messages: InboundMessage[] = [];
  const statuses: StatusUpdate[] = [];
  const entries = (payload as { entry?: { changes?: { field?: string; value?: RawValue }[] }[] } | null)?.entry ?? [];

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      if (change.field && change.field !== "messages") continue;
      const value = change.value ?? {};
      const names = new Map((value.contacts ?? []).map((contact) => [contact.wa_id, contact.profile?.name ?? null]));
      for (const message of value.messages ?? []) {
        if (!message.id || !message.from) continue;
        messages.push({
          waMessageId: message.id,
          waId: message.from,
          profileName: names.get(message.from) ?? null,
          timestamp: toDate(message.timestamp),
          type: message.type ?? "unknown",
          body: bodyOf(message),
          mediaId: mediaIdOf(message),
          raw: message,
        });
      }
      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue;
        statuses.push({ waMessageId: status.id, status: status.status, timestamp: toDate(status.timestamp) });
      }
    }
  }
  return { messages, statuses };
}

export function isWithinHours(date: Date, hoursStart: number, hoursEnd: number, timeZone = "Africa/Abidjan"): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hourCycle: "h23", timeZone }).format(date).replace(/\D/g, "")
  );
  if (hoursStart === hoursEnd) return true;
  return hoursStart < hoursEnd ? hour >= hoursStart && hour < hoursEnd : hour >= hoursStart || hour < hoursEnd;
}
