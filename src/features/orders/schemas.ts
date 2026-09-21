import { z } from "zod";
import { ORDER_STATUSES } from "./constants";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const orderIdSchema = z.uuid();

export const updateOrderStatusSchema = z.object({
  id: orderIdSchema,
  status: orderStatusSchema,
});

export const ordersFilterSchema = z.object({
  status: orderStatusSchema.or(z.literal("all")).catch("all"),
  search: z.string().trim().max(100).catch(""),
  dateFrom: isoDate.optional().catch(undefined),
  dateTo: isoDate.optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});
