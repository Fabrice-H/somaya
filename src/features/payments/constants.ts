import type { BadgeTone } from "@/shared/components/admin/ui/Badge";
import type { PaymentProviderId, PaymentStatus } from "./types";

export const PAYMENT_PROVIDERS = ["jeko", "fake"] as const satisfies readonly PaymentProviderId[];

export const PAYMENT_RETURN_PATH = "/commande/retour";
export const FAKE_CHECKOUT_PATH = "/commande/paiement-test";
export const JEKO_WEBHOOK_PATH = "/api/payments/jeko/webhook";
export const JEKO_DEFAULT_API_BASE = "https://api.jeko.africa/partner_api";
export const JEKO_SIGNATURE_HEADER = "jeko-signature";
export const JEKO_REQUEST_TIMEOUT_MS = 15_000;

export const PAYMENT_STATUS_ORDER: Record<PaymentStatus, number> = {
  pending: 0,
  processing: 1,
  paid: 3,
  failed: 2,
  cancelled: 2,
  refunded: 4,
};

export const PAYMENT_STATUS_BADGES: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "En attente", tone: "warning" },
  processing: { label: "En cours", tone: "info" },
  paid: { label: "Payée", tone: "success" },
  failed: { label: "Échouée", tone: "danger" },
  cancelled: { label: "Annulée", tone: "neutral" },
  refunded: { label: "Remboursée", tone: "info" },
};

export const ORDER_CHANNEL_LABELS = {
  whatsapp: "WhatsApp",
  online: "En ligne",
} as const;

export const ONLINE_OPERATORS = [
  { id: "wave", label: "Wave", logo: "/images/wave.webp", bg: "#1dc4ff", fit: "contain" },
  { id: "orange", label: "Orange Money", logo: "/images/orange_money.webp", bg: "#000000", fit: "contain" },
  { id: "mtn", label: "MTN MoMo", logo: "/images/momo_money.webp", bg: "#ffcb05", fit: "cover" },
  { id: "moov", label: "Moov Money", logo: "/images/moov_money.webp", bg: "#0066b3", fit: "cover" },
] as const;

export const ONLINE_OPERATOR_IDS = ["wave", "orange", "mtn", "moov", "djamo"] as const;

export const PAYMENT_METHOD_NAMES: Record<string, string> = {
  wave: "Wave",
  orange: "Orange Money",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  djamo: "Djamo",
  fake: "Test",
};

export const PAYMENT_RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 } as const;
