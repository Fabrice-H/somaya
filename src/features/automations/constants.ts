import type { AutomationDefinition } from "./types";

export const AUTOMATIONS_PATH = "/admin/reglages";
export const AUTOMATION_RUNS_LIMIT = 30;
export const AUTOMATION_SETTINGS_CACHE_MS = 30_000;

export const AUTOMATIONS: AutomationDefinition[] = [
  {
    key: "stock.apply",
    label: "Déduire le stock",
    description: "Quand une commande est confirmée ou payée en ligne, le stock des articles est déduit une seule fois.",
    group: "Commandes",
    on: ["order.confirmed", "order.paid"],
    defaultEnabled: true,
    available: true,
  },
  {
    key: "stock.restore",
    label: "Restituer le stock",
    description: "Quand une commande est annulée après déduction, le stock est remis.",
    group: "Commandes",
    on: ["order.cancelled"],
    defaultEnabled: true,
    available: true,
  },
  {
    key: "loyalty.credit",
    label: "Créditer les points fidélité",
    description: "Quand une commande est livrée, la cliente reçoit ses points selon les règles du programme.",
    group: "Fidélité",
    on: ["order.delivered"],
    defaultEnabled: true,
    available: true,
  },
  {
    key: "loyalty.revoke",
    label: "Retirer les points d'une commande annulée",
    description: "Si une commande livrée est finalement annulée, les points gagnés sont retirés.",
    group: "Fidélité",
    on: ["order.cancelled"],
    defaultEnabled: true,
    available: true,
  },
  {
    key: "customers.inactive",
    label: "Détecter les clientes inactives",
    description:
      "Chaque jour, les clientes sans commande depuis la durée réglée dans Fidélité sont marquées inactives (une fois par période).",
    group: "Clientes",
    on: [],
    defaultEnabled: true,
    available: true,
  },
  {
    key: "notify.order_confirmed",
    label: "Prévenir la cliente : commande confirmée",
    description: "Message automatique dès qu'une commande est confirmée.",
    group: "Notifications",
    on: ["order.confirmed"],
    defaultEnabled: false,
    available: false,
  },
  {
    key: "notify.order_shipped",
    label: "Prévenir la cliente : commande expédiée",
    description: "Message automatique dès qu'une commande est expédiée.",
    group: "Notifications",
    on: ["order.shipped"],
    defaultEnabled: false,
    available: false,
  },
  {
    key: "notify.customer_inactive",
    label: "Relancer une cliente inactive",
    description: "Message de relance quand une cliente devient inactive.",
    group: "Notifications",
    on: ["customer.inactive"],
    defaultEnabled: false,
    available: false,
  },
  {
    key: "notify.admin",
    label: "Alerter la boutique",
    description: "Nouvelle commande, paiement reçu, paiement en double : alerte instantanée à l'équipe.",
    group: "Notifications",
    on: ["order.created", "order.paid", "payment.duplicate"],
    defaultEnabled: false,
    available: false,
  },
];

export const AUTOMATION_KEYS = AUTOMATIONS.map((automation) => automation.key);

export const RUN_STATUS_LABELS = {
  ok: { label: "OK", tone: "success" },
  skipped: { label: "Ignorée", tone: "neutral" },
  error: { label: "Erreur", tone: "danger" },
} as const;
