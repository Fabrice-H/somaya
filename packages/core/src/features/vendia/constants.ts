import type { DomainEventType } from "../events/types";
import type { VendiaEvent } from "./types";

export const VENDIA_EVENT_MAP: Partial<Record<DomainEventType, VendiaEvent>> = {
  "order.created": "order.created",
  "order.confirmed": "order.confirmed",
  "order.shipped": "order.shipped",
  "order.delivered": "order.delivered",
  "customer.created": "customer.created",
};

export const VENDIA_SOURCE_EVENTS = Object.keys(VENDIA_EVENT_MAP) as DomainEventType[];

export const VENDIA_CURRENCY = "XOF";
export const VENDIA_REQUEST_TIMEOUT_MS = 8_000;
export const VENDIA_MAX_ATTEMPTS = 8;
export const VENDIA_RETRY_BASE_MS = 5 * 60_000;
export const VENDIA_RETRY_MAX_MS = 6 * 60 * 60_000;
export const VENDIA_RETRY_BATCH = 50;

export const DELIVERY_STATUSES = ["pending", "sent", "failed"] as const;
