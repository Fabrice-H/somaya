import "server-only";
import { db, domainEvents } from "@/shared/lib/db";
import { registerStockHandlers } from "@/features/stock/server/handlers";
import { aggregateIdOf, createEventBus } from "../bus";
import type { DomainEvent, EmitResult } from "../types";

const bus = createEventBus(async (event) => {
  const { type, ...payload } = event;
  await db.insert(domainEvents).values({ type, aggregateId: aggregateIdOf(event), payload });
});

registerStockHandlers(bus);

export function emitEvent(event: DomainEvent): Promise<EmitResult> {
  return bus.emit(event);
}
