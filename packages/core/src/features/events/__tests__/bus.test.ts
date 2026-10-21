import { describe, expect, it, vi } from "vitest";
import { aggregateIdOf, createEventBus } from "../bus";
import type { DomainEvent } from "../types";

const delivered: DomainEvent = { type: "order.delivered", orderId: "order-1", customerId: "customer-1" };

describe("createEventBus", () => {
  it("journalise puis exécute les gestionnaires abonnés", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const run = vi.fn().mockResolvedValue(undefined);
    const bus = createEventBus(persist);
    bus.register({ id: "a", on: ["order.delivered"], run });
    bus.register({ id: "b", on: ["order.created"], run: vi.fn() });

    await bus.emit(delivered);

    expect(persist).toHaveBeenCalledWith(delivered);
    expect(run).toHaveBeenCalledTimes(1);
    expect(bus.handlersFor("order.delivered").map((h) => h.id)).toEqual(["a"]);
  });

  it("n'exécute jamais deux fois le même gestionnaire", () => {
    const bus = createEventBus(async () => undefined);
    const handler = { id: "same", on: ["order.paid"] as const, run: vi.fn() };
    bus.register(handler);
    bus.register(handler);
    expect(bus.handlersFor("order.paid")).toHaveLength(1);
  });

  it("isole les erreurs : un gestionnaire ou le journal qui plante ne bloque rien", async () => {
    const log = vi.fn();
    const bus = createEventBus(async () => {
      throw new Error("db down");
    }, log);
    const second = vi.fn().mockResolvedValue({ warnings: ["Stock insuffisant"] });
    bus.register({
      id: "boom",
      on: ["order.delivered"],
      run: async () => {
        throw new Error("boom");
      },
    });
    bus.register({ id: "ok", on: ["order.delivered"], run: second });

    const result = await bus.emit(delivered);

    expect(second).toHaveBeenCalled();
    expect(result.warnings).toEqual(["Stock insuffisant"]);
    expect(log).toHaveBeenCalledTimes(2);
  });

  it("déduit l'agrégat de l'événement", () => {
    expect(aggregateIdOf(delivered)).toBe("order-1");
    expect(aggregateIdOf({ type: "customer.created", customerId: "c" })).toBe("c");
    expect(aggregateIdOf({ type: "loyalty.points_added", customerId: "c", orderId: null, points: 3 })).toBe("c");
  });
});
