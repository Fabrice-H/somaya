"use client";

import { MessageCircle, RefreshCw } from "lucide-react";
import { whatsappHref } from "@/shared/lib/phone";
import { buildFollowUpMessage, buildStatusMessage, toIvorianPhone } from "../../utils";
import type { OrderNotificationData } from "../../types";

export function NotifyCustomerButton({ order }: { order: OrderNotificationData }) {
  const openWhatsApp = (message: string) =>
    window.open(whatsappHref(toIvorianPhone(order.customer_phone), message), "_blank", "noopener,noreferrer");

  return (
    <>
      {order.status === "pending" && (
        <button type="button" onClick={() => openWhatsApp(buildFollowUpMessage(order))} className="btn-link">
          <RefreshCw size={15} strokeWidth={1.5} aria-hidden />
          Relancer le client
        </button>
      )}
      <button type="button" onClick={() => openWhatsApp(buildStatusMessage(order))} className="btn-secondary btn-sm">
        <MessageCircle size={15} strokeWidth={1.5} aria-hidden />
        Notifier via WhatsApp
      </button>
    </>
  );
}
