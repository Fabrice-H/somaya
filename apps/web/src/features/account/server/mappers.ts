import type { Customer, Order, OrderItem } from "@/shared/lib/db/schema";
import { LOYALTY_LEVELS } from "@/features/loyalty/constants";
import type { AccountCustomer, AccountOrderDetail, AccountOrderSummary } from "../types";

export function toAccountCustomer(row: Customer): AccountCustomer {
  return {
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    phone: row.phone,
    email: row.email,
    address: row.address,
    commune: row.commune,
    loyalty_points: row.loyaltyPoints,
    loyalty_level: LOYALTY_LEVELS.find((level) => level === row.loyaltyLevel) ?? "new",
    account_created_at: row.accountCreatedAt?.toISOString() ?? null,
  };
}

export function toAccountOrderSummary(row: Order, itemsCount: number): AccountOrderSummary {
  return {
    id: row.id,
    order_number: row.orderNumber,
    status: row.status,
    payment_status: row.paymentStatus,
    payment_method: row.paymentMethod,
    total: Number(row.total),
    items_count: itemsCount,
    created_at: row.createdAt.toISOString(),
  };
}

export function toAccountOrderDetail(row: Order & { items: OrderItem[] }): AccountOrderDetail {
  return {
    ...toAccountOrderSummary(
      row,
      row.items.reduce((sum, item) => sum + item.quantity, 0)
    ),
    subtotal: Number(row.subtotal),
    delivery_fee: Number(row.deliveryFee),
    address: row.customerAddress,
    commune: row.customerCommune,
    delivered_at: row.deliveredAt?.toISOString() ?? null,
    updated_at: row.updatedAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      product_name: item.productName,
      product_image: item.productImage,
      lot_name: item.lotName,
      quantity: item.quantity,
      line_total: Number(item.lineTotal),
    })),
  };
}
