import "server-only";
import { eq } from "drizzle-orm";
import { db, whatsappSettings } from "@/shared/lib/db";
import { DEFAULT_AWAY_MESSAGE, DEFAULT_WELCOME_MESSAGE, WHATSAPP_SETTINGS_ID } from "../constants";
import type { WhatsappSettingsData } from "../types";
import { getWhatsappConfig } from "./config";

export async function getWhatsappSettings(): Promise<WhatsappSettingsData> {
  const row = await db.query.whatsappSettings.findFirst({ where: eq(whatsappSettings.id, WHATSAPP_SETTINGS_ID) });
  return {
    autoReplyEnabled: row?.autoReplyEnabled ?? true,
    hoursStart: row?.hoursStart ?? 9,
    hoursEnd: row?.hoursEnd ?? 19,
    welcomeMessage: row?.welcomeMessage?.trim() || DEFAULT_WELCOME_MESSAGE,
    awayMessage: row?.awayMessage?.trim() || DEFAULT_AWAY_MESSAGE,
    configured: getWhatsappConfig() !== null,
  };
}
