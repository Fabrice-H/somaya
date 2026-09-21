import Link from "next/link";
import { Eye } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { ORDERS_PATH, PAYMENT_METHOD_SHORT_LABELS } from "../../../constants";
import { formatOrderDate } from "../../../utils";
import type { OrderSummary } from "../../../types";
import { PAYMENT_METHOD_ICONS } from "../icons";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { ORDERS_GRID_COLUMNS } from "./table-layout";

export function OrderRow({ order, isLast }: { order: OrderSummary; isLast: boolean }) {
  const PaymentIcon = PAYMENT_METHOD_ICONS[order.payment_method];

  return (
    <Link
      href={`${ORDERS_PATH}/${order.id}`}
      className="block md:grid transition-colors hover:bg-[#fafafa]"
      style={{
        gridTemplateColumns: ORDERS_GRID_COLUMNS,
        gap: 16,
        padding: "16px 20px",
        borderBottom: isLast ? "none" : "1px solid rgba(81,31,41,0.1)",
      }}
    >
      <span style={{ fontSize: 12, color: "#6b6b6b", fontFamily: "monospace" }}>{order.order_number}</span>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#000000", marginBottom: 2 }}>{order.customer_name}</p>
        <p style={{ fontSize: 12, color: "#6b6b6b" }}>{order.customer_phone}</p>
      </div>
      <span style={{ fontSize: 13, color: "#6b6b6b" }}>{formatOrderDate(order.created_at)}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#000000", textAlign: "right", fontFamily: "monospace" }}>
        {formatPrice(order.total)}
      </span>
      <span className="flex items-center gap-2" style={{ fontSize: 13, color: "#6b6b6b" }}>
        <PaymentIcon size={14} />
        <span className="hidden lg:inline">{PAYMENT_METHOD_SHORT_LABELS[order.payment_method]}</span>
      </span>
      <div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="flex justify-center">
        <span
          style={{
            width: 32,
            height: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b6b6b",
          }}
        >
          <Eye size={16} />
        </span>
      </div>
    </Link>
  );
}
