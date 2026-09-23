import "server-only";
import { automationRuns, db } from "@/shared/lib/db";
import type { EventBus } from "@/features/events/bus";
import { isOrderEvent, type DomainEvent } from "@/features/events/types";
import { creditDeliveredOrder, revokeOrderPoints } from "@/features/loyalty/server/service";
import { applyOrderStock, restoreOrderStock } from "@/features/stock/server/service";
import { AUTOMATIONS } from "../constants";
import type { AutomationKey, AutomationRunResult } from "../types";
import { isAutomationEnabled } from "./settings";

type Runner = (event: DomainEvent, bus: EventBus) => Promise<AutomationRunResult>;

const orderOnly =
  (run: (orderId: string, event: DomainEvent, bus: EventBus) => Promise<AutomationRunResult>): Runner =>
  (event, bus) =>
    isOrderEvent(event)
      ? run(event.orderId, event, bus)
      : Promise.resolve({ status: "skipped", message: "Événement sans commande" });

const RUNNERS: Partial<Record<AutomationKey, Runner>> = {
  "stock.apply": orderOnly(async (orderId) => {
    const result = await applyOrderStock(orderId);
    if (!result.changed) return { status: "skipped", message: "Stock déjà déduit" };
    return {
      status: "ok",
      message: result.warnings.length ? result.warnings.join(" · ") : "Stock déduit",
      warnings: result.warnings,
    };
  }),
  "stock.restore": orderOnly(async (orderId) => {
    const result = await restoreOrderStock(orderId);
    return result.changed
      ? { status: "ok", message: "Stock restitué" }
      : { status: "skipped", message: "Rien à restituer" };
  }),
  "loyalty.credit": orderOnly(async (orderId, _event, bus) => {
    const result = await creditDeliveredOrder(orderId);
    if (!result.credited || !result.customerId) return { status: "skipped", message: "Déjà crédité ou non éligible" };
    await bus.emit({ type: "loyalty.points_added", customerId: result.customerId, orderId, points: result.points });
    return {
      status: "ok",
      message: `${result.points} point${result.points > 1 ? "s" : ""} crédité${result.points > 1 ? "s" : ""}`,
    };
  }),
  "loyalty.revoke": orderOnly(async (orderId) => {
    const result = await revokeOrderPoints(orderId);
    return result.revoked
      ? { status: "ok", message: `${result.points} points retirés` }
      : { status: "skipped", message: "Aucun point à retirer" };
  }),
};

export async function recordRun(
  key: AutomationKey,
  eventType: string,
  aggregateId: string | null,
  result: AutomationRunResult
) {
  await db.insert(automationRuns).values({
    automationKey: key,
    eventType,
    aggregateId,
    status: result.status,
    message: result.message?.slice(0, 500) ?? null,
  });
}

export function registerAutomations(bus: EventBus) {
  for (const automation of AUTOMATIONS) {
    const runner = RUNNERS[automation.key];
    if (!runner || automation.on.length === 0) continue;
    bus.register({
      id: automation.key,
      on: automation.on,
      run: async (event) => {
        if (!(await isAutomationEnabled(automation.key))) return;
        const aggregateId = isOrderEvent(event) ? event.orderId : event.customerId;
        let result: AutomationRunResult;
        try {
          result = await runner(event, bus);
        } catch (error) {
          result = { status: "error", message: error instanceof Error ? error.message : "Erreur inconnue" };
          console.error(`automation ${automation.key} failed`, error);
        }
        await recordRun(automation.key, event.type, aggregateId, result).catch((error: unknown) =>
          console.error("recordRun failed", error)
        );
        return { warnings: result.warnings };
      },
    });
  }
}
