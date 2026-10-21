import { z } from "zod";
import { CUSTOMER_NOTES_MAX_LENGTH, CUSTOMER_SEGMENTS } from "./constants";

export const customerIdSchema = z.uuid();

export const customerSegmentSchema = z.enum(CUSTOMER_SEGMENTS);

export const customersFilterSchema = z.object({
  segment: customerSegmentSchema.or(z.literal("all")).catch("all"),
  search: z.string().trim().max(100).catch(""),
  sort: z.enum(["recent", "spent", "orders", "name"]).catch("recent"),
  page: z.coerce.number().int().min(1).catch(1),
});

export const updateCustomerNotesSchema = z.object({
  id: customerIdSchema,
  notes: z.string().trim().max(CUSTOMER_NOTES_MAX_LENGTH),
});

export const segmentRulesSchema = z.object({
  newDays: z.number().int().min(1).max(365),
  activeDays: z.number().int().min(1).max(730),
  loyalOrders: z.number().int().min(2).max(100),
  vipSpent: z.number().int().min(0),
  vipOrders: z.number().int().min(2).max(1000),
  inactiveDays: z.number().int().min(7).max(1095),
});
