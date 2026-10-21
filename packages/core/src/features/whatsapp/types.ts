export type ConversationMode = "auto" | "human";
export type MessageDirection = "in" | "out";
export type MessageAuthor = "customer" | "team" | "assistant" | "system";

export type InboundMessage = {
  waMessageId: string;
  waId: string;
  profileName: string | null;
  timestamp: Date;
  type: string;
  body: string | null;
  mediaId: string | null;
  raw: unknown;
};

export type StatusUpdate = { waMessageId: string; status: string; timestamp: Date };

export type ParsedWebhook = { messages: InboundMessage[]; statuses: StatusUpdate[] };

export type ConversationSummary = {
  id: string;
  wa_id: string;
  phone: string | null;
  display_name: string;
  customer_id: string | null;
  mode: ConversationMode;
  status: string;
  unread_count: number;
  last_message: string | null;
  last_message_at: string | null;
  within_window: boolean;
};

export type MessageDto = {
  id: string;
  direction: MessageDirection;
  author: MessageAuthor;
  type: string;
  body: string | null;
  media_url: string | null;
  status: string;
  created_at: string;
};

export type ConversationDetail = ConversationSummary & { messages: MessageDto[] };

export type WhatsappSettingsData = {
  autoReplyEnabled: boolean;
  hoursStart: number;
  hoursEnd: number;
  welcomeMessage: string;
  awayMessage: string;
  configured: boolean;
};

export type WhatsappActionResult = { ok: true; message?: string } | { ok: false; error: string };
