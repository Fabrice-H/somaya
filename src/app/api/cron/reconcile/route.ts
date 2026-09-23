import { NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, orders } from "@/shared/lib/db";
import { emitEvent } from "@/features/events/server/events";
import { creditDeliveredOrder, listDeliveredOrdersWithoutPoints } from "@/features/loyalty/server/service";
import { LOYALTY_REASONS } from "@/features/loyalty/constants";
import { reconcilePayments, type ReconcileReport } from "@/features/payments/server/service";
import { applyOrderStock } from "@/features/stock/server/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const report: ReconcileReport = {
    paymentsChecked: 0,
    paymentsUpdated: 0,
    attemptsAbandoned: 0,
    ordersExpired: 0,
    stockApplied: 0,
    loyaltyCredited: 0,
  };

  try {
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
  } catch (error) {
    console.error("reconcile failed", error);
    return NextResponse.json({ ok: false, report }, { status: 500 });
  }

  return NextResponse.json({ ok: true, report, at: new Date().toISOString() });
}
