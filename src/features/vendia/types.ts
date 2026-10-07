export type VendiaEvent =
  "order.created" | "order.confirmed" | "order.shipped" | "order.delivered" | "cart.abandoned" | "customer.created";

export type VendiaItem = { name: string; quantity?: number; price?: number };

export type VendiaPayload = {
  event: VendiaEvent;
  id: string;
  customer: { name?: string; phone: string; email?: string };
  order?: { id: string; total?: number; currency?: string; items?: VendiaItem[] };
  metadata?: Record<string, unknown>;
};

export type VendiaResponse = { ok?: boolean; duplicate?: boolean; outcome?: string };

export type DeliveryStatus = "pending" | "sent" | "failed";

export type DeliveryResult =
  | { status: "sent"; outcome: string | null; responseStatus: number }
  | { status: "retry" | "failed"; error: string; responseStatus: number | null };
