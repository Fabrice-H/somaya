import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { customers, db, whatsappConversations, whatsappMessages } from "@/shared/lib/db";
import type { WhatsappConversation } from "@/shared/lib/db/schema";
import { normalizePhone } from "@/shared/lib/phone";
import { isAutomationEnabled } from "@/features/automations/server/settings";
import { recordRun } from "@/features/automations/server/runner";
import { WHATSAPP_AUTO_REPLY_COOLDOWN_MS } from "../constants";
import type { InboundMessage, MessageAuthor, StatusUpdate } from "../types";
import { isWithinHours } from "../webhook";
import { markAsRead, sendImage, sendText } from "./client";
import { getWhatsappSettings } from "./settings";

export type InboundOutcome = "stored" | "duplicate";

async function findOrCreateConversation(message: InboundMessage): Promise<WhatsappConversation> {
  const phone = normalizePhone(`+${message.waId}`);
  const customer = phone
    ? await db.query.customers.findFirst({ where: eq(customers.phone, phone), columns: { id: true } })
    : null;
  const [row] = await db
    .insert(whatsappConversations)
    .values({
      waId: message.waId,
      phone,
      profileName: message.profileName,
      customerId: customer?.id ?? null,
      lastInboundAt: message.timestamp,
      lastMessageAt: message.timestamp,
      unreadCount: 1,
    })
    .onConflictDoUpdate({
      target: whatsappConversations.waId,
      set: {
        profileName: sql`coalesce(excluded.profile_name, ${whatsappConversations.profileName})`,
        customerId: sql`coalesce(${whatsappConversations.customerId}, excluded.customer_id)`,
        phone: sql`coalesce(${whatsappConversations.phone}, excluded.phone)`,
        lastInboundAt: message.timestamp,
        lastMessageAt: message.timestamp,
        unreadCount: sql`${whatsappConversations.unreadCount} + 1`,
        status: "open",
        updatedAt: new Date(),
      },
    })
    .returning();
  return row;
}

export async function storeInbound(message: InboundMessage): Promise<InboundOutcome> {
  const conversation = await findOrCreateConversation(message);
  const inserted = await db
    .insert(whatsappMessages)
    .values({
      conversationId: conversation.id,
      waMessageId: message.waMessageId,
      direction: "in",
      type: message.type,
      body: message.body,
      author: "customer",
      status: "received",
      raw: message.raw,
      createdAt: message.timestamp,
    })
    .onConflictDoNothing()
    .returning({ id: whatsappMessages.id });
  if (inserted.length === 0) {
    await db
      .update(whatsappConversations)
      .set({ unreadCount: sql`greatest(${whatsappConversations.unreadCount} - 1, 0)` })
      .where(eq(whatsappConversations.id, conversation.id));
    return "duplicate";
  }
  void markAsRead(message.waMessageId);
  await maybeAutoReply(conversation);
  return "stored";
}

export async function applyStatuses(statuses: StatusUpdate[]): Promise<void> {
  for (const status of statuses) {
    await db
      .update(whatsappMessages)
      .set({ status: status.status })
      .where(eq(whatsappMessages.waMessageId, status.waMessageId));
  }
}

export async function sendOutbound(
  conversation: Pick<WhatsappConversation, "id" | "waId">,
  body: string,
  author: MessageAuthor,
  image?: { url: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = image ? await sendImage(conversation.waId, image.url, body) : await sendText(conversation.waId, body);
  const now = new Date();
  await db.insert(whatsappMessages).values({
    conversationId: conversation.id,
    waMessageId: result.ok ? result.waMessageId : null,
    direction: "out",
    type: image ? "image" : "text",
    body,
    mediaUrl: image?.url ?? null,
    author,
    status: result.ok ? "sent" : "failed",
    raw: result.ok ? null : { error: result.error },
    createdAt: now,
  });
  await db
    .update(whatsappConversations)
    .set({ lastMessageAt: now, updatedAt: now })
    .where(eq(whatsappConversations.id, conversation.id));
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

async function maybeAutoReply(conversation: WhatsappConversation): Promise<void> {
  if (conversation.mode !== "auto") return;
  if (!(await isAutomationEnabled("whatsapp.auto_reply"))) return;
  const settings = await getWhatsappSettings();
  if (!settings.autoReplyEnabled || !settings.configured) return;

  const now = Date.now();
  if (conversation.lastAutoReplyAt && now - conversation.lastAutoReplyAt.getTime() < WHATSAPP_AUTO_REPLY_COOLDOWN_MS)
    return;

  const open = isWithinHours(new Date(now), settings.hoursStart, settings.hoursEnd);
  const body = open ? settings.welcomeMessage : settings.awayMessage;
  const [claimed] = await db
    .update(whatsappConversations)
    .set({ lastAutoReplyAt: new Date(now) })
    .where(eq(whatsappConversations.id, conversation.id))
    .returning({ id: whatsappConversations.id });
  if (!claimed) return;

  const result = await sendOutbound(conversation, body, "assistant");
  await recordRun("whatsapp.auto_reply", "whatsapp.inbound", null, {
    status: result.ok ? "ok" : "error",
    message: result.ok ? (open ? "Message d'accueil envoyé" : "Message d'absence envoyé") : result.error,
  });
}

export async function latestConversationByWaId(waId: string) {
  return db.query.whatsappConversations.findFirst({
    where: eq(whatsappConversations.waId, waId),
    orderBy: [desc(whatsappConversations.lastMessageAt)],
  });
}
