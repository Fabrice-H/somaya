"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, whatsappConversations, whatsappSettings } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { CONVERSATIONS_PATH, MESSAGE_MAX_LENGTH, WHATSAPP_SETTINGS_ID } from "../constants";
import type { WhatsappActionResult } from "../types";
import { sendOutbound } from "./service";

const replySchema = z.object({
  conversationId: z.uuid(),
  body: z.string().trim().min(1, "Message vide").max(MESSAGE_MAX_LENGTH),
  imageUrl: z.string().url().optional(),
});

const modeSchema = z.object({ conversationId: z.uuid(), mode: z.enum(["auto", "human"]) });

const settingsSchema = z.object({
  autoReplyEnabled: z.boolean(),
  hoursStart: z.number().int().min(0).max(23),
  hoursEnd: z.number().int().min(0).max(23),
  welcomeMessage: z.string().trim().max(1000),
  awayMessage: z.string().trim().max(1000),
});

export async function replyToConversationAction(input: unknown): Promise<WhatsappActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Message invalide" };

  const conversation = await db.query.whatsappConversations.findFirst({
    where: eq(whatsappConversations.id, parsed.data.conversationId),
  });
  if (!conversation) return { ok: false, error: "Conversation introuvable" };

  const result = await sendOutbound(
    conversation,
    parsed.data.body,
    "team",
    parsed.data.imageUrl ? { url: parsed.data.imageUrl } : undefined
  );
  await db
    .update(whatsappConversations)
    .set({ unreadCount: 0, mode: "human", updatedAt: new Date() })
    .where(eq(whatsappConversations.id, conversation.id));
  revalidatePath(`${CONVERSATIONS_PATH}/${conversation.id}`);
  revalidatePath(CONVERSATIONS_PATH);
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function setConversationModeAction(input: unknown): Promise<WhatsappActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };
  const parsed = modeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };
  await db
    .update(whatsappConversations)
    .set({ mode: parsed.data.mode, updatedAt: new Date() })
    .where(eq(whatsappConversations.id, parsed.data.conversationId));
  revalidatePath(`${CONVERSATIONS_PATH}/${parsed.data.conversationId}`);
  revalidatePath(CONVERSATIONS_PATH);
  return { ok: true };
}

export async function markConversationReadAction(conversationId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin || !z.uuid().safeParse(conversationId).success) return;
  await db.update(whatsappConversations).set({ unreadCount: 0 }).where(eq(whatsappConversations.id, conversationId));
  revalidatePath(CONVERSATIONS_PATH);
}

export async function updateWhatsappSettingsAction(input: unknown): Promise<WhatsappActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Réglages invalides" };
  const values = { ...parsed.data, updatedAt: new Date() };
  await db
    .insert(whatsappSettings)
    .values({ id: WHATSAPP_SETTINGS_ID, ...values })
    .onConflictDoUpdate({ target: whatsappSettings.id, set: values });
  revalidatePath(CONVERSATIONS_PATH);
  return { ok: true, message: "Réglages enregistrés" };
}
