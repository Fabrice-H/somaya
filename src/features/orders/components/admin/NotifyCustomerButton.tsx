"use client";

import { MessageCircle, RefreshCw } from "lucide-react";
import { whatsappHref } from "@/shared/lib/phone";
import { buildFollowUpMessage, buildStatusMessage, toIvorianPhone } from "../../utils";
import type { OrderNotificationData } from "../../types";

const BUTTON_CLASS = "flex items-center justify-start gap-2 w-full transition-all duration-200 cursor-pointer";

const BUTTON_STYLE = { padding: "10px 14px", fontSize: 14, fontWeight: 500 } as const;

export function NotifyCustomerButton({ order }: { order: OrderNotificationData }) {
  const openWhatsApp = (message: string) =>
    window.open(whatsappHref(toIvorianPhone(order.customer_phone), message), "_blank", "noopener,noreferrer");

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => openWhatsApp(buildStatusMessage(order))}
        className={`${BUTTON_CLASS} bg-white hover:bg-[#fafafa]`}
        style={{ ...BUTTON_STYLE, color: "#000000", border: "1px solid rgba(81,31,41,0.2)" }}
      >
        <MessageCircle size={16} />
        Notifier le statut
      </button>
      {order.status === "pending" && (
        <button
          type="button"
          onClick={() => openWhatsApp(buildFollowUpMessage(order))}
          className={`${BUTTON_CLASS} bg-white hover:bg-[#511f29]/5`}
          style={{ ...BUTTON_STYLE, color: "#3c161e", border: "1px solid #511f29" }}
        >
          <RefreshCw size={16} />
          Relancer le client
        </button>
      )}
    </div>
  );
}
