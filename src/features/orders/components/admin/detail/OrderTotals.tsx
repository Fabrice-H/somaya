import { formatPrice } from "@/shared/lib/format";
import type { OrderDetail } from "../../../types";

type OrderTotalsProps = Pick<OrderDetail, "subtotal" | "delivery_fee" | "total">;

const AMOUNT_STYLE = { fontVariantNumeric: "tabular-nums" } as const;

export function OrderTotals({ subtotal, delivery_fee, total }: OrderTotalsProps) {
  return (
    <div className="space-y-2" style={{ padding: "16px 24px", background: "#fafafa" }}>
      <div className="flex justify-between" style={{ fontSize: 13, color: "#6b6b6b" }}>
        <span>Sous-total</span>
        <span style={AMOUNT_STYLE}>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between" style={{ fontSize: 13, color: "#6b6b6b" }}>
        <span>Livraison</span>
        <span style={AMOUNT_STYLE}>{formatPrice(delivery_fee)}</span>
      </div>
      <div
        className="flex justify-between pt-2"
        style={{ fontSize: 16, fontWeight: 600, color: "#000000", borderTop: "1px solid rgba(81,31,41,0.1)" }}
      >
        <span>Total</span>
        <span style={AMOUNT_STYLE}>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
