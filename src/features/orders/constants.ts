import type { OrderStatus, OrderStatusFilter, OrdersStats, PaymentMethod, StatusColors } from "./types";

export const ORDERS_CACHE_TAG = "orders";

export const ORDERS_PAGE_SIZE = 10;

export const ORDERS_PATH = "/admin/commandes";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, StatusColors> = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  confirmed: { bg: "#DBEAFE", text: "#1E40AF" },
  preparing: { bg: "#EDE9FE", text: "#5B21B6" },
  shipped: { bg: "#CFFAFE", text: "#0E7490" },
  delivered: { bg: "#D1FAE5", text: "#065F46" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
};

export const ORDER_STATUS_FILTERS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  ...ORDER_STATUSES.map((value) => ({
    value,
    label: value === "preparing" ? "En prép." : ORDER_STATUS_LABELS[value],
  })),
];

export const PAYMENT_METHOD_SHORT_LABELS: Record<PaymentMethod, string> = {
  mobile_money: "Mobile",
  cash: "Espèces",
  bank_transfer: "Virement",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mobile_money: "Mobile Money",
  cash: "Espèces",
  bank_transfer: "Virement bancaire",
};

export const CUSTOMER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: "Votre commande {orderNumber} a bien été reçue et est en attente de confirmation.",
  confirmed: "Bonne nouvelle ! Votre commande {orderNumber} a été confirmée.",
  preparing: "Votre commande {orderNumber} est en cours de préparation.",
  shipped: "Votre commande {orderNumber} est en cours de livraison !",
  delivered: "Votre commande {orderNumber} a été livrée. Merci pour votre confiance !",
  cancelled: "Votre commande {orderNumber} a été annulée.",
};

export const EMPTY_ORDERS_STATS: OrdersStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

export const ORDER_FILTER_KEYS = ["status", "search", "dateFrom", "dateTo"] as const;
