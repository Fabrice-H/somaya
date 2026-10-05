import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db, whatsappConversations, whatsappMessages } from "@/shared/lib/db";
import type { WhatsappConversation, WhatsappMessage } from "@/shared/lib/db/schema";
import { formatPhone } from "@/shared/lib/phone";
import { assertAdmin } from "@/features/auth/server/session";
import { CONVERSATION_MESSAGES_LIMIT, CONVERSATIONS_PAGE_SIZE, WHATSAPP_SERVICE_WINDOW_MS } from "../constants";
import type { ConversationDetail, ConversationSummary, MessageAuthor, MessageDirection, MessageDto } from "../types";

const withinWindow = (lastInboundAt: Date | null) =>
  lastInboundAt !== null && Date.now() - lastInboundAt.getTime() < WHATSAPP_SERVICE_WINDOW_MS;

function toSummary(row: WhatsappConversation, lastMessage: string | null): ConversationSummary {
  return {
    id: row.id,
    wa_id: row.waId,
    phone: row.phone,
    display_name: row.profileName?.trim() || (row.phone ? formatPhone(row.phone) : `+${row.waId}`),
    customer_id: row.customerId,
    mode: row.mode === "human" ? "human" : "auto",
    status: row.status,
    unread_count: row.unreadCount,
    last_message: lastMessage,
    last_message_at: row.lastMessageAt?.toISOString() ?? null,
    within_window: withinWindow(row.lastInboundAt),
  };
}

const toMessage = (row: WhatsappMessage): MessageDto => ({
  id: row.id,
  direction: row.direction as MessageDirection,
  author: row.author as MessageAuthor,
  type: row.type,
  body: row.body,
  media_url: row.mediaUrl,
  status: row.status,
  created_at: row.createdAt.toISOString(),
});

export async function getConversations(): Promise<ConversationSummary[]> {
  await assertAdmin();
  const rows = await db
    .select({
      conversation: whatsappConversations,
      lastMessage: sql<
        string | null
      >`(select body from whatsapp_messages m where m.conversation_id = ${whatsappConversations.id} order by m.created_at desc limit 1)`,
    })
    .from(whatsappConversations)
    .orderBy(desc(whatsappConversations.lastMessageAt))
    .limit(CONVERSATIONS_PAGE_SIZE);
  return rows.map((row) => toSummary(row.conversation, row.lastMessage));
}

export async function getConversation(id: string): Promise<ConversationDetail | null> {
  await assertAdmin();
  const row = await db.query.whatsappConversations.findFirst({ where: eq(whatsappConversations.id, id) });
  if (!row) return null;
  const messages = await db.query.whatsappMessages.findMany({
    where: eq(whatsappMessages.conversationId, row.id),
    orderBy: [asc(whatsappMessages.createdAt)],
    limit: CONVERSATION_MESSAGES_LIMIT,
  });
  const last = messages.at(-1);
  return { ...toSummary(row, last?.body ?? null), messages: messages.map(toMessage) };
}

export async function getUnreadConversationsCount(): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`count(*) filter (where ${whatsappConversations.unreadCount} > 0)`.mapWith(Number) })
    .from(whatsappConversations);
  return row?.total ?? 0;
}
