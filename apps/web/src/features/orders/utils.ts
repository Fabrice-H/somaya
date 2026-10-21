import { CUSTOMER_STATUS_MESSAGES } from "./constants";
import type { OrderNotificationData } from "./types";
import { formatPrice } from "@/shared/lib/format";

export { escapeLikePattern, getVisiblePages } from "@/shared/lib/utils";

const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const mediumDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function generateOrderNumber(date = new Date()): string {
  const stamp = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SM-${stamp}-${random}`;
}

export const formatOrderDateLong = (value: string) => longDateFormatter.format(new Date(value));

export const formatOrderDate = (value: string) => mediumDateFormatter.format(new Date(value));

export const formatOrderDateShort = (value: string) => shortDateFormatter.format(new Date(value));

export function toIvorianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("225") ? digits : `225${digits}`;
}

export function buildStatusMessage(order: OrderNotificationData): string {
  const statusMessage = CUSTOMER_STATUS_MESSAGES[order.status].replace("{orderNumber}", order.order_number);
  return `Bonjour ${order.customer_first_name},\n\n${statusMessage}\n\nTotal: ${formatPrice(order.total)}\n\nL'équipe SO'MAYA`;
}

export function buildFollowUpMessage(order: OrderNotificationData): string {
  return `Bonjour ${order.customer_first_name},\n\nNous avons bien reçu votre commande ${order.order_number}.\n\nMerci de confirmer votre disponibilité pour la livraison.\n\nL'équipe SO'MAYA`;
}
