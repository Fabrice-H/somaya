import "server-only";
import { automationSettings, db } from "@/shared/lib/db";
import { AUTOMATION_SETTINGS_CACHE_MS, AUTOMATIONS } from "../constants";
import type { AutomationKey } from "../types";

let cache: { at: number; map: Map<AutomationKey, boolean> } | null = null;

export async function getEnabledMap(force = false): Promise<Map<AutomationKey, boolean>> {
  if (!force && cache && Date.now() - cache.at < AUTOMATION_SETTINGS_CACHE_MS) return cache.map;
  const rows = await db.select().from(automationSettings);
  const stored = new Map(rows.map((row) => [row.key, row.enabled]));
  const map = new Map<AutomationKey, boolean>(
    AUTOMATIONS.map((automation) => [
      automation.key,
      automation.available && (stored.get(automation.key) ?? automation.defaultEnabled),
    ])
  );
  cache = { at: Date.now(), map };
  return map;
}

export function invalidateEnabledMap() {
  cache = null;
}

export async function isAutomationEnabled(key: AutomationKey): Promise<boolean> {
  return (await getEnabledMap()).get(key) ?? false;
}
