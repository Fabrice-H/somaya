import { and, asc, eq, isNull, lt } from "drizzle-orm";
import { db, domainEvents } from "@somaya/db";
import { domainEventBus } from "../../events/server/events";
import { EVENT_TYPES } from "../../events/constants";
import type { DomainEvent, DomainEventType } from "../../events/types";
import { automationsFor, executeAutomation } from "./runner";

export const OUTBOX_BATCH_SIZE = 50;
export const OUTBOX_MAX_AGE_MS = 24 * 60 * 60_000;

export type OutboxReport = { dispatched: number; expired: number; runs: number };

const isEventType = (value: string): value is DomainEventType => (EVENT_TYPES as readonly string[]).includes(value);

export async function dispatchOutboxEvents(now = new Date()): Promise<OutboxReport> {
  const rows = await db
    .select()
    .from(domainEvents)
    .where(isNull(domainEvents.dispatchedAt))
    .orderBy(asc(domainEvents.createdAt))
    .limit(OUTBOX_BATCH_SIZE);

  const report: OutboxReport = { dispatched: 0, expired: 0, runs: 0 };
  for (const row of rows) {
    const stale = row.createdAt.getTime() < now.getTime() - OUTBOX_MAX_AGE_MS;
    if (!stale && isEventType(row.type)) {
      const event = { type: row.type, ...(row.payload as object) } as DomainEvent;
      for (const automation of automationsFor("outbox", event.type)) {
        const result = await executeAutomation(automation, event, domainEventBus);
        if (result) report.runs += 1;
      }
      report.dispatched += 1;
    } else {
      report.expired += 1;
    }
    await db
      .update(domainEvents)
      .set({ dispatchedAt: now })
      .where(and(eq(domainEvents.id, row.id), isNull(domainEvents.dispatchedAt)));
  }
  return report;
}

export async function expireUndispatched(now = new Date()): Promise<number> {
  const rows = await db
    .update(domainEvents)
    .set({ dispatchedAt: now })
    .where(
      and(isNull(domainEvents.dispatchedAt), lt(domainEvents.createdAt, new Date(now.getTime() - OUTBOX_MAX_AGE_MS)))
    )
    .returning({ id: domainEvents.id });
  return rows.length;
}
