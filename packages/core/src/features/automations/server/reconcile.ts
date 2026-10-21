import { and, eq, isNull, sql } from "drizzle-orm";
import { db, orders } from "@somaya/db";
import { emitEvent } from "../../events/server/events";
import { LOYALTY_REASONS } from "../../loyalty/constants";
import { creditDeliveredOrder, listDeliveredOrdersWithoutPoints } from "../../loyalty/server/service";
import { reconcilePayments, type ReconcileReport } from "../../payments/server/service";
import { applyOrderStock } from "../../stock/server/service";
import { retryVendiaDeliveries } from "../../vendia/server/service";

export async function runReconcile(): Promise<ReconcileReport> {
  const report: ReconcileReport = {
    paymentsChecked: 0,
    paymentsUpdated: 0,
    attemptsAbandoned: 0,
    ordersExpired: 0,
    stockApplied: 0,
    loyaltyCredited: 0,
    vendiaRetried: 0,
    vendiaSent: 0,
  };

  Object.assign(report, await reconcilePayments());

  const unappliedStock = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.paymentStatus, "paid"), isNull(orders.stockAppliedAt), sql`${orders.status} <> 'cancelled'`))
    .limit(100);
  for (const order of unappliedStock) {
    const result = await applyOrderStock(order.id);
    if (result.changed) report.stockApplied += 1;
  }

  for (const orderId of await listDeliveredOrdersWithoutPoints()) {
    const result = await creditDeliveredOrder(orderId, LOYALTY_REASONS.earn);
    if (!result.credited || !result.customerId) continue;
    report.loyaltyCredited += 1;
    await emitEvent({ type: "loyalty.points_added", customerId: result.customerId, orderId, points: result.points });
  }

  const vendia = await retryVendiaDeliveries();
  report.vendiaRetried = vendia.checked;
  report.vendiaSent = vendia.sent;
  return report;
}
