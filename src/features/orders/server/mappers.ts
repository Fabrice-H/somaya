import type { Order as DbOrder, OrderItem as DbOrderItem } from "@/shared/lib/db/schema";
import type { Payment as DbPayment } from "@/shared/lib/db/schema";
import { toPaymentDto } from "@/features/payments/server/queries";
import type { OrderDetail, OrderItem, OrderSummary } from "../types";

type OrderSummaryRow = Pick<
  DbOrder,
  | "id"
  | "orderNumber"
  | "status"
  | "customerFirstName"
  | "customerLastName"
  | "customerPhone"
  | "paymentMethod"
  | "paymentStatus"
  | "orderChannel"
  | "total"
  | "createdAt"
>;

export function toOrderSummary(order: OrderSummaryRow): OrderSummary {
  return {
    id: order.id,
    order_number: order.orderNumber,
    status: order.status,
    customer_name: `${order.customerFirstName} ${order.customerLastName}`,
    customer_phone: order.customerPhone,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    order_channel: order.orderChannel === "online" ? "online" : "whatsapp",
    total: Number(order.total),
    created_at: order.createdAt.toISOString(),
  };
}

export function toOrderItem(item: DbOrderItem): OrderItem {
  return {
    id: item.id,
    product_name: item.productName,
    product_price: Number(item.productPrice),
    product_image: item.productImage,
    quantity: item.quantity,
    lot_name: item.lotName,
    line_total: Number(item.lineTotal),
  };
}

export function toOrderDetail(order: DbOrder & { items: DbOrderItem[]; payments?: DbPayment[] }): OrderDetail {
  return {
    ...toOrderSummary(order),
    customer_id: order.customerId,
    customer_first_name: order.customerFirstName,
    customer_email: order.customerEmail,
    customer_address: order.customerAddress,
    customer_commune: order.customerCommune,
    customer_notes: order.customerNotes,
    paid_at: order.paidAt?.toISOString() ?? null,
    payments: (order.payments ?? []).map(toPaymentDto),
    subtotal: Number(order.subtotal),
    delivery_fee: Number(order.deliveryFee),
    delivered_at: order.deliveredAt?.toISOString() ?? null,
    stock_applied_at: order.stockAppliedAt?.toISOString() ?? null,
    updated_at: order.updatedAt.toISOString(),
    items: order.items.map(toOrderItem),
  };
}
