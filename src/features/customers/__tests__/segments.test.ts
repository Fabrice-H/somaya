import { describe, expect, it } from "vitest";
import { DEFAULT_SEGMENT_RULES } from "../constants";
import { computeSegment, daysAgo } from "../segments";

const now = new Date("2026-09-22T12:00:00Z");
const stats = (overrides: Partial<Parameters<typeof computeSegment>[0]>) => ({
  ordersCount: 1,
  totalSpent: 0,
  firstOrderAt: daysAgo(5, now),
  lastOrderAt: daysAgo(5, now),
  ...overrides,
});

describe("computeSegment", () => {
  it("nouveau : une seule commande récente", () => {
    expect(computeSegment(stats({}), DEFAULT_SEGMENT_RULES, now)).toBe("new");
  });

  it("actif : commande récente mais plus une nouveauté", () => {
    expect(computeSegment(stats({ ordersCount: 2, lastOrderAt: daysAgo(40, now) }), DEFAULT_SEGMENT_RULES, now)).toBe(
      "active"
    );
    expect(
      computeSegment(
        stats({ firstOrderAt: daysAgo(45, now), lastOrderAt: daysAgo(45, now) }),
        DEFAULT_SEGMENT_RULES,
        now
      )
    ).toBe("active");
  });

  it("fidèle : au moins 3 commandes", () => {
    expect(computeSegment(stats({ ordersCount: 3 }), DEFAULT_SEGMENT_RULES, now)).toBe("loyal");
  });

  it("VIP : montant dépensé ou nombre de commandes", () => {
    expect(computeSegment(stats({ ordersCount: 2, totalSpent: 300_000 }), DEFAULT_SEGMENT_RULES, now)).toBe("vip");
    expect(computeSegment(stats({ ordersCount: 6 }), DEFAULT_SEGMENT_RULES, now)).toBe("vip");
  });

  it("VIP prime sur inactif", () => {
    expect(computeSegment(stats({ ordersCount: 6, lastOrderAt: daysAgo(400, now) }), DEFAULT_SEGMENT_RULES, now)).toBe(
      "vip"
    );
  });

  it("inactif : sans commande depuis 120 jours ou sans commande", () => {
    expect(computeSegment(stats({ ordersCount: 2, lastOrderAt: daysAgo(121, now) }), DEFAULT_SEGMENT_RULES, now)).toBe(
      "inactive"
    );
    expect(
      computeSegment(stats({ ordersCount: 0, firstOrderAt: null, lastOrderAt: null }), DEFAULT_SEGMENT_RULES, now)
    ).toBe("inactive");
  });

  it("respecte des règles personnalisées", () => {
    const rules = { ...DEFAULT_SEGMENT_RULES, loyalOrders: 2, newDays: 10, inactiveDays: 10 };
    expect(computeSegment(stats({ ordersCount: 2 }), rules, now)).toBe("loyal");
    expect(computeSegment(stats({ firstOrderAt: daysAgo(15, now), lastOrderAt: daysAgo(15, now) }), rules, now)).toBe(
      "inactive"
    );
  });
});
