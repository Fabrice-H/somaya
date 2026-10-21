import type { BadgeTone } from "../../shared/ui-tones";

export const WHATSAPP_SETTINGS_ID = "00000000-0000-0000-0000-000000000005";
export const WHATSAPP_API_VERSION = "v21.0";
export const WHATSAPP_GRAPH_BASE = "https://graph.facebook.com";
export const WHATSAPP_SIGNATURE_HEADER = "x-hub-signature-256";
export const WHATSAPP_WEBHOOK_PATH = "/api/whatsapp/webhook";
export const WHATSAPP_MAX_BODY_BYTES = 256 * 1024;
export const WHATSAPP_REQUEST_TIMEOUT_MS = 15_000;
export const WHATSAPP_SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;
export const WHATSAPP_AUTO_REPLY_COOLDOWN_MS = 12 * 60 * 60 * 1000;

export const CONVERSATIONS_PATH = "/admin/conversations";
export const CONVERSATIONS_PAGE_SIZE = 30;
export const CONVERSATION_MESSAGES_LIMIT = 200;
export const MESSAGE_MAX_LENGTH = 4096;

export const DEFAULT_WELCOME_MESSAGE =
  "Bonjour et bienvenue chez SO'MAYA 🌸 Merci pour votre message, nous vous répondons dans les plus brefs délais.";
export const DEFAULT_AWAY_MESSAGE =
  "Bonjour, merci pour votre message 🌸 Notre équipe est absente pour le moment et vous répondra dès l'ouverture. En attendant, découvrez nos pièces sur notre boutique en ligne.";

export const CONVERSATION_MODE_LABELS: Record<"auto" | "human", { label: string; tone: BadgeTone }> = {
  auto: { label: "Automatique", tone: "info" },
  human: { label: "Prise en main", tone: "primary" },
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  received: "Reçu",
  queued: "En file",
  sent: "Envoyé",
  delivered: "Remis",
  read: "Lu",
  failed: "Échec",
};
