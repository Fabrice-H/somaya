import { DEFAULT_LOYALTY_LEVELS, LOYALTY_LEVELS } from "./constants";
import type { LoyaltyLevel, LoyaltyLevelRule, LoyaltySettingsData } from "./types";

export function computeEarnedPoints(
  subtotal: number,
  settings: Pick<LoyaltySettingsData, "pointsPerStep" | "amountStep">
): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0 || settings.amountStep <= 0) return 0;
  return Math.floor(subtotal / settings.amountStep) * settings.pointsPerStep;
}

export function orderedLevels(levels: LoyaltyLevelRule[] = DEFAULT_LOYALTY_LEVELS): LoyaltyLevelRule[] {
  return LOYALTY_LEVELS.map(
    (key) => levels.find((level) => level.key === key) ?? DEFAULT_LOYALTY_LEVELS.find((level) => level.key === key)!
  );
}

export function levelForPoints(points: number, levels: LoyaltyLevelRule[] = DEFAULT_LOYALTY_LEVELS): LoyaltyLevel {
  const reached = orderedLevels(levels).filter((level) => points >= level.minPoints);
  return reached.at(-1)?.key ?? "new";
}

export function nextLevel(
  points: number,
  levels: LoyaltyLevelRule[] = DEFAULT_LOYALTY_LEVELS
): LoyaltyLevelRule | null {
  return orderedLevels(levels).find((level) => level.minPoints > points) ?? null;
}
