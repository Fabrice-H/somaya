import { db, domainEvents } from "@somaya/db";
import { registerAutomations } from "../../automations/server/runner";
import { aggregateIdOf, createEventBus } from "../bus";
import type { DomainEvent, EmitResult } from "../types";

const bus = createEventBus(async (event) => {
  const { type, ...payload } = event;
  await db.insert(domainEvents).values({ type, aggregateId: aggregateIdOf(event), payload });
});

registerAutomations(bus, "inline");

export const domainEventBus = bus;

export function emitEvent(event: DomainEvent): Promise<EmitResult> {
  return bus.emit(event);
}
