import "server-only";
import { desc, inArray } from "drizzle-orm";
import { automationRuns, db } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { AUTOMATION_RUNS_LIMIT, AUTOMATIONS } from "../constants";
import type { AutomationKey, AutomationsOverview, RunStatus } from "../types";
import { getEnabledMap } from "./settings";

const toStatus = (value: string): RunStatus => (value === "ok" || value === "error" ? value : "skipped");

export async function getAutomationsOverview(): Promise<AutomationsOverview> {
  await assertAdmin();
  const [enabled, runs, lastByKey] = await Promise.all([
    getEnabledMap(true),
    db.select().from(automationRuns).orderBy(desc(automationRuns.createdAt)).limit(AUTOMATION_RUNS_LIMIT),
    db
      .selectDistinctOn([automationRuns.automationKey], {
        key: automationRuns.automationKey,
        status: automationRuns.status,
        createdAt: automationRuns.createdAt,
      })
      .from(automationRuns)
      .where(
        inArray(
          automationRuns.automationKey,
          AUTOMATIONS.map((a) => a.key)
        )
      )
      .orderBy(automationRuns.automationKey, desc(automationRuns.createdAt)),
  ]);
  const last = new Map(lastByKey.map((row) => [row.key, row]));
  const labels = new Map(AUTOMATIONS.map((a) => [a.key, a.label]));

  return {
    automations: AUTOMATIONS.map((automation) => ({
      ...automation,
      enabled: enabled.get(automation.key) ?? false,
      lastRunAt: last.get(automation.key)?.createdAt.toISOString() ?? null,
      lastStatus: last.has(automation.key) ? toStatus(last.get(automation.key)!.status) : null,
    })),
    runs: runs.map((run) => ({
      id: run.id,
      automation_key: run.automationKey as AutomationKey,
      automation_label: labels.get(run.automationKey as AutomationKey) ?? run.automationKey,
      event_type: run.eventType,
      aggregate_id: run.aggregateId,
      status: toStatus(run.status),
      message: run.message,
      created_at: run.createdAt.toISOString(),
    })),
  };
}
