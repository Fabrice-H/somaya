import { isOrderEvent, type DomainEvent, type EmitResult, type EventHandler } from "./types";

type Persist = (event: DomainEvent) => Promise<void>;
type Log = (message: string, error: unknown) => void;

export function aggregateIdOf(event: DomainEvent): string {
  return isOrderEvent(event) ? event.orderId : event.customerId;
}

export function createEventBus(persist: Persist, log: Log = console.error) {
  const handlers: EventHandler[] = [];

  return {
    register(handler: EventHandler) {
      if (!handlers.some((existing) => existing.id === handler.id)) handlers.push(handler);
    },
    handlersFor(type: DomainEvent["type"]) {
      return handlers.filter((handler) => handler.on.includes(type));
    },
    async emit(event: DomainEvent): Promise<EmitResult> {
      try {
        await persist(event);
      } catch (error) {
        log(`event persist failed (${event.type})`, error);
      }

      const warnings: string[] = [];
      for (const handler of handlers.filter((candidate) => candidate.on.includes(event.type))) {
        try {
          const result = await handler.run(event);
          if (result?.warnings?.length) warnings.push(...result.warnings);
        } catch (error) {
          log(`event handler ${handler.id} failed (${event.type})`, error);
        }
      }
      return { warnings };
    },
  };
}

export type EventBus = ReturnType<typeof createEventBus>;
