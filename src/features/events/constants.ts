import type { DomainEventType, OrderEventType } from "./types";
import type { OrderStatus } from "@/features/orders/types";

export const EVENT_TYPES = [
  "order.created",
  "order.confirmed",
  "order.preparing",
  "order.shipped",
  "order.delivered",
  "order.cancelled",
  "order.paid",
  "customer.created",
  "customer.inactive",
  "loyalty.points_added",
] as const satisfies readonly DomainEventType[];

export const ORDER_STATUS_EVENTS: Record<OrderStatus, OrderEventType> = {
  pending: "order.created",
  confirmed: "order.confirmed",
  preparing: "order.preparing",
  shipped: "order.shipped",
  delivered: "order.delivered",
  cancelled: "order.cancelled",
};

export const EVENT_LABELS: Record<DomainEventType, string> = {
  "order.created": "Commande reçue",
  "order.confirmed": "Commande confirmée",
  "order.preparing": "Commande en préparation",
  "order.shipped": "Commande expédiée",
  "order.delivered": "Commande livrée",
  "order.cancelled": "Commande annulée",
  "order.paid": "Commande payée en ligne",
  "customer.created": "Nouveau client",
  "customer.inactive": "Client devenu inactif",
  "loyalty.points_added": "Points de fidélité ajoutés",
};
