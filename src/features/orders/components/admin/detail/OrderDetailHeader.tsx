import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, ORDERS_PATH } from "../../../constants";
import { formatOrderDateLong } from "../../../utils";
import type { OrderDetail } from "../../../types";
import { ORDER_STATUS_ICONS } from "../icons";

export function OrderDetailHeader({ order }: { order: OrderDetail }) {
  const colors = ORDER_STATUS_COLORS[order.status];
  const StatusIcon = ORDER_STATUS_ICONS[order.status];

  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap"
      style={{ padding: "24px 40px", background: "white", borderBottom: "1px solid rgba(81,31,41,0.1)" }}
    >
      <div className="flex items-center gap-4">
        <Link
          href={ORDERS_PATH}
          aria-label="Retour aux commandes"
          className="transition-colors hover:bg-[#fafafa]"
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(81,31,41,0.15)",
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#000000" }}>Commande {order.order_number}</h1>
          <p style={{ fontSize: 13, color: "#6b6b6b", marginTop: 2 }}>
            <Clock size={12} className="inline mr-1" style={{ verticalAlign: "middle" }} />
            {formatOrderDateLong(order.created_at)}
          </p>
        </div>
      </div>
      <div
        className="inline-flex items-center gap-2"
        style={{ padding: "8px 16px", background: colors.bg, color: colors.text, fontSize: 13, fontWeight: 600 }}
      >
        <StatusIcon size={16} />
        {ORDER_STATUS_LABELS[order.status]}
      </div>
    </div>
  );
}
