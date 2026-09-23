import "server-only";
import { and, isNotNull, lt, or, isNull, sql } from "drizzle-orm";
import { customers, db } from "@/shared/lib/db";
import { getSegmentRules } from "@/features/customers/server/service";
import { daysAgo } from "@/features/customers/segments";
import { emitEvent } from "@/features/events/server/events";
import { recordRun } from "./runner";
import { isAutomationEnabled } from "./settings";

export async function detectInactiveCustomers(): Promise<{ detected: number; skipped: boolean }> {
  if (!(await isAutomationEnabled("customers.inactive"))) return { detected: 0, skipped: true };

  const rules = await getSegmentRules();
  const threshold = daysAgo(rules.inactiveDays, new Date());
  const rows = await db
    .select({ id: customers.id })
    .from(customers)
    .where(
      and(
        isNotNull(customers.lastOrderAt),
        lt(customers.lastOrderAt, threshold),
        or(isNull(customers.inactiveNotifiedAt), sql`${customers.inactiveNotifiedAt} < ${customers.lastOrderAt}`)
      )
    )
    .limit(200);

  let detected = 0;
  for (const row of rows) {
    const now = new Date();
    const [claimed] = await db
      .update(customers)
      .set({ inactiveNotifiedAt: now, updatedAt: now })
      .where(
        and(
          sql`${customers.id} = ${row.id}`,
          or(isNull(customers.inactiveNotifiedAt), sql`${customers.inactiveNotifiedAt} < ${customers.lastOrderAt}`)
        )
      )
      .returning({ id: customers.id });
    if (!claimed) continue;
    await emitEvent({ type: "customer.inactive", customerId: row.id });
    await recordRun("customers.inactive", "customer.inactive", row.id, {
      status: "ok",
      message: "Cliente marquée inactive",
    });
    detected += 1;
  }
  return { detected, skipped: false };
}
