"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { automationSettings, db } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { AUTOMATION_KEYS, AUTOMATIONS, AUTOMATIONS_PATH } from "../constants";
import type { AutomationActionResult, AutomationKey } from "../types";
import { invalidateEnabledMap } from "./settings";

const toggleSchema = z.object({
  key: z.enum(AUTOMATION_KEYS as [AutomationKey, ...AutomationKey[]]),
  enabled: z.boolean(),
});

export async function toggleAutomationAction(input: unknown): Promise<AutomationActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Non autorisé" };

  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Automatisation inconnue" };
  const definition = AUTOMATIONS.find((automation) => automation.key === parsed.data.key);
  if (!definition?.available) return { ok: false, error: "Cette automatisation n'est pas encore disponible" };

  await db
    .insert(automationSettings)
    .values({ key: parsed.data.key, enabled: parsed.data.enabled, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: automationSettings.key,
      set: { enabled: parsed.data.enabled, updatedAt: new Date() },
    });
  invalidateEnabledMap();
  revalidatePath(AUTOMATIONS_PATH);
  return { ok: true };
}
