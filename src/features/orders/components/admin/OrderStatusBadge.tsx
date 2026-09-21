import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../constants";
import type { OrderStatus } from "../../types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { bg, text } = ORDER_STATUS_COLORS[status];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color: text,
        textTransform: "uppercase",
        letterSpacing: "0.02em",
      }}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
