import type { OrderStatus } from "@/features/orders/types";

export type OrderEventType =
  | "order.created"
  | "order.confirmed"
  | "order.preparing"
  | "order.shipped"
  | "order.delivered"
  | "order.cancelled"
  | "order.paid";

export type OrderEvent = {
  type: OrderEventType;
  orderId: string;
  customerId: string | null;
  previousStatus?: OrderStatus;
};

export type CustomerEvent = { type: "customer.created" | "customer.inactive"; customerId: string };

export type LoyaltyEvent = {
  type: "loyalty.points_added";
  customerId: string;
  orderId: string | null;
  points: number;
};

export type DomainEvent = OrderEvent | CustomerEvent | LoyaltyEvent;

export const isOrderEvent = (event: DomainEvent): event is OrderEvent => event.type.startsWith("order.");

export type DomainEventType = DomainEvent["type"];

export type HandlerResult = { warnings?: string[] } | void;

export type EventHandler = {
  id: string;
  on: readonly DomainEventType[];
  run: (event: DomainEvent) => Promise<HandlerResult>;
};

export type EmitResult = { warnings: string[] };
