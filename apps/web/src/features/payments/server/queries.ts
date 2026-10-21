import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, orders, payments } from "@/shared/lib/db";
import type { Payment } from "@/shared/lib/db/schema";
import { getCustomerSession } from "@/features/account/server/session";
import type { PaymentDto, PaymentReturnView } from "../types";
import { syncPaymentByReference } from "./service";

export function toPaymentDto(row: Payment): PaymentDto {
  return {
    id: row.id,
    provider: row.provider === "fake" ? "fake" : "jeko",
    provider_reference: row.providerReference,
    reference: row.reference,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    payment_method: row.paymentMethod,
    failure_reason: row.failureReason,
    paid_at: row.paidAt?.toISOString() ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function getOrderPayments(orderId: string): Promise<PaymentDto[]> {
  const rows = await db.query.payments.findMany({
    where: eq(payments.orderId, orderId),
    orderBy: [desc(payments.createdAt)],
  });
  return rows.map(toPaymentDto);
}

export async function getPaymentReturnView(orderNumber: string): Promise<PaymentReturnView> {
  if (!/^SM-\d{8}-[A-Z0-9]{4}$/.test(orderNumber)) return { kind: "unknown" };
  const [payment, order, customer] = await Promise.all([
    syncPaymentByReference(orderNumber),
    db.query.orders.findFirst({ where: eq(orders.orderNumber, orderNumber) }),
    getCustomerSession(),
  ]);
  if (!order) return { kind: "unknown" };

  const base = { orderNumber: order.orderNumber, total: Number(order.total), firstName: order.customerFirstName };
  if (order.paymentStatus === "paid") {
    return { kind: "paid", ...base, hasAccount: customer !== null && customer.id === order.customerId };
  }
  if (!payment || payment.status === "pending" || payment.status === "processing") return { kind: "pending", ...base };
  return { kind: "failed", ...base, reason: payment.failureReason };
}
