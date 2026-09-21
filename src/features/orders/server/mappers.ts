import type { Order as DbOrder, OrderItem as DbOrderItem } from "@/shared/lib/db/schema";
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

export function toOrderDetail(order: DbOrder & { items: DbOrderItem[] }): OrderDetail {
  return {
    ...toOrderSummary(order),
    customer_first_name: order.customerFirstName,
    customer_email: order.customerEmail,
    customer_address: order.customerAddress,
    customer_commune: order.customerCommune,
    customer_notes: order.customerNotes,
    payment_status: order.paymentStatus,
    subtotal: Number(order.subtotal),
    delivery_fee: Number(order.deliveryFee),
    delivered_at: order.deliveredAt?.toISOString() ?? null,
    updated_at: order.updatedAt.toISOString(),
    items: order.items.map(toOrderItem),
  };
}
