import { z } from "zod";
import { segmentRulesSchema } from "@/features/customers/schemas";
import { LOYALTY_ADJUST_MAX_POINTS, LOYALTY_LEVELS, LOYALTY_REASON_MAX_LENGTH } from "./constants";

export const loyaltyLevelSchema = z.enum(LOYALTY_LEVELS);

export const loyaltyLevelRuleSchema = z.object({
  key: loyaltyLevelSchema,
  label: z.string().trim().min(1, "Nom du niveau requis").max(40),
  minPoints: z.number().int().min(0).max(1_000_000),
});

export const loyaltyLevelsSchema = z
  .array(loyaltyLevelRuleSchema)
  .length(LOYALTY_LEVELS.length)
  .refine((levels) => LOYALTY_LEVELS.every((key) => levels.some((level) => level.key === key)), "Niveaux incomplets")
  .refine((levels) => levels.find((level) => level.key === "new")?.minPoints === 0, "Le premier niveau commence à 0")
  .refine((levels) => {
    const ordered = LOYALTY_LEVELS.map((key) => levels.find((level) => level.key === key)!.minPoints);
    return ordered.every((value, index) => index === 0 || value > ordered[index - 1]);
  }, "Les paliers doivent être croissants");

export const loyaltySettingsSchema = z.object({
  isEnabled: z.boolean(),
  pointsPerStep: z.number().int().min(1).max(1000),
  amountStep: z.number().int().min(100).max(1_000_000),
  levels: loyaltyLevelsSchema,
  segmentRules: segmentRulesSchema,
});

export const adjustPointsSchema = z.object({
  customerId: z.uuid(),
  points: z
    .number()
    .int()
    .min(-LOYALTY_ADJUST_MAX_POINTS)
    .max(LOYALTY_ADJUST_MAX_POINTS)
    .refine((value) => value !== 0, "Indiquez un nombre de points différent de zéro"),
  reason: z.string().trim().min(3, "Indiquez un motif").max(LOYALTY_REASON_MAX_LENGTH),
});
