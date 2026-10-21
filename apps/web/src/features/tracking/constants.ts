import type { OrderStatus } from "@/features/orders/types";

export const TRACKING_PATH = "/suivi";
export const TRACKING_RATE_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 } as const;

export const ORDER_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "pending", label: "Reçue", description: "Nous avons bien reçu votre commande." },
  { status: "confirmed", label: "Confirmée", description: "Votre commande est validée par notre équipe." },
  { status: "preparing", label: "Préparation", description: "Vos articles sont préparés avec soin." },
  { status: "shipped", label: "Expédiée", description: "Votre commande est en route." },
  { status: "delivered", label: "Livrée", description: "Merci pour votre confiance." },
];

export const ORDER_STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};
