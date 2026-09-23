import type { DomainEventType } from "@/features/events/types";

export type AutomationKey =
  | "stock.apply"
  | "stock.restore"
  | "loyalty.credit"
  | "loyalty.revoke"
  | "customers.inactive"
  | "notify.order_confirmed"
  | "notify.order_shipped"
  | "notify.customer_inactive"
  | "notify.admin";

export type AutomationGroup = "Commandes" | "Fidélité" | "Clientes" | "Notifications";

export type AutomationDefinition = {
  key: AutomationKey;
  label: string;
  description: string;
  group: AutomationGroup;
  on: readonly DomainEventType[];
  defaultEnabled: boolean;
  available: boolean;
};

export type RunStatus = "ok" | "skipped" | "error";

export type AutomationRunResult = { status: RunStatus; message?: string; warnings?: string[] };

export type AutomationView = AutomationDefinition & {
  enabled: boolean;
  lastRunAt: string | null;
  lastStatus: RunStatus | null;
};

export type AutomationRunDto = {
  id: string;
  automation_key: AutomationKey;
  automation_label: string;
  event_type: string;
  aggregate_id: string | null;
  status: RunStatus;
  message: string | null;
  created_at: string;
};

export type AutomationsOverview = { automations: AutomationView[]; runs: AutomationRunDto[] };

export type AutomationActionResult = { ok: true } | { ok: false; error: string };
