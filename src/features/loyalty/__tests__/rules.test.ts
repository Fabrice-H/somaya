import { describe, expect, it } from "vitest";
import { DEFAULT_LOYALTY_LEVELS } from "../constants";
import { computeEarnedPoints, levelForPoints, nextLevel } from "../rules";
import { loyaltyLevelsSchema } from "../schemas";

const rules = { pointsPerStep: 1, amountStep: 1000 };

describe("computeEarnedPoints", () => {
  it("donne 1 point par tranche de 1 000 FCFA, tranche entamée non comptée", () => {
    expect(computeEarnedPoints(12_500, rules)).toBe(12);
    expect(computeEarnedPoints(999, rules)).toBe(0);
    expect(computeEarnedPoints(1000, rules)).toBe(1);
  });

  it("respecte des règles personnalisées", () => {
    expect(computeEarnedPoints(10_000, { pointsPerStep: 5, amountStep: 2000 })).toBe(25);
  });

  it("ne donne rien pour un montant nul, négatif ou une règle invalide", () => {
    expect(computeEarnedPoints(0, rules)).toBe(0);
    expect(computeEarnedPoints(-50, rules)).toBe(0);
    expect(computeEarnedPoints(5000, { pointsPerStep: 1, amountStep: 0 })).toBe(0);
  });
});

describe("levelForPoints", () => {
  it.each([
    [0, "new"],
    [99, "new"],
    [100, "regular"],
    [299, "regular"],
    [300, "loyal"],
    [800, "vip"],
    [5000, "vip"],
  ])("%s points → %s", (points, level) => {
    expect(levelForPoints(points, DEFAULT_LOYALTY_LEVELS)).toBe(level);
  });

  it("utilise les paliers personnalisés", () => {
    const custom = DEFAULT_LOYALTY_LEVELS.map((level) => (level.key === "vip" ? { ...level, minPoints: 10 } : level));
    expect(levelForPoints(10, custom)).toBe("vip");
  });

  it("indique le prochain palier", () => {
    expect(nextLevel(150, DEFAULT_LOYALTY_LEVELS)?.key).toBe("loyal");
    expect(nextLevel(900, DEFAULT_LOYALTY_LEVELS)).toBeNull();
  });
});

describe("loyaltyLevelsSchema", () => {
  it("accepte les paliers par défaut", () => {
    expect(loyaltyLevelsSchema.safeParse(DEFAULT_LOYALTY_LEVELS).success).toBe(true);
  });

  it("refuse des paliers non croissants ou un premier palier différent de 0", () => {
    const broken = DEFAULT_LOYALTY_LEVELS.map((level) => (level.key === "loyal" ? { ...level, minPoints: 50 } : level));
    expect(loyaltyLevelsSchema.safeParse(broken).success).toBe(false);
    const shifted = DEFAULT_LOYALTY_LEVELS.map((level) => (level.key === "new" ? { ...level, minPoints: 5 } : level));
    expect(loyaltyLevelsSchema.safeParse(shifted).success).toBe(false);
  });
});
