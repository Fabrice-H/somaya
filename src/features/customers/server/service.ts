import "server-only";
import { eq, sql } from "drizzle-orm";
import { customers, db, loyaltySettings } from "@/shared/lib/db";
import { normalizePhone } from "@/shared/lib/phone";
import { LOYALTY_SETTINGS_ID } from "@/features/loyalty/constants";
import { DEFAULT_SEGMENT_RULES } from "../constants";
import { segmentRulesSchema } from "../schemas";
import type { CustomerIdentity, SegmentRules } from "../types";

export type UpsertCustomerResult = { id: string; created: boolean };

export async function upsertCustomerFromOrder(identity: CustomerIdentity): Promise<UpsertCustomerResult | null> {
  const phone = normalizePhone(identity.phone);
  if (!phone) return null;

  const email = identity.email?.trim().toLowerCase() || null;
  const [row] = await db
    .insert(customers)
    .values({ phone, email, firstName: identity.firstName.trim(), lastName: identity.lastName.trim() })
    .onConflictDoUpdate({
      target: customers.phone,
      set: {
        email: sql`coalesce(${customers.email}, excluded.email)`,
        firstName: sql`coalesce(nullif(${customers.firstName}, ''), excluded.first_name)`,
        lastName: sql`coalesce(nullif(${customers.lastName}, ''), excluded.last_name)`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: customers.id, created: sql<boolean>`(xmax = 0)` });

  return row ? { id: row.id, created: row.created } : null;
}

export async function refreshCustomerStats(customerId: string): Promise<void> {
  await db.execute(sql`
    update customers set
      orders_count = (select count(*) from orders where customer_id = ${customerId} and status <> 'cancelled'),
      total_spent = coalesce((select sum(total) from orders where customer_id = ${customerId} and status = 'delivered'), 0),
      first_order_at = (select min(created_at) from orders where customer_id = ${customerId} and status <> 'cancelled'),
      last_order_at = (select max(created_at) from orders where customer_id = ${customerId} and status <> 'cancelled'),
      updated_at = now()
    where id = ${customerId}
  `);
}

export async function getSegmentRules(): Promise<SegmentRules> {
  const row = await db.query.loyaltySettings.findFirst({
    where: eq(loyaltySettings.id, LOYALTY_SETTINGS_ID),
    columns: { segmentRules: true },
  });
  const parsed = segmentRulesSchema.safeParse(row?.segmentRules);
  return parsed.success ? parsed.data : DEFAULT_SEGMENT_RULES;
}
