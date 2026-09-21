import Image from "next/image";
import { Package } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import type { OrderItem } from "../../../types";

export function OrderItemRow({ item, isLast }: { item: OrderItem; isLast: boolean }) {
  return (
    <div
      className="flex items-center gap-4"
      style={{ padding: "16px 24px", borderBottom: isLast ? "none" : "1px solid rgba(81,31,41,0.1)" }}
    >
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, background: "#fafafa" }}>
        {item.product_image ? (
          <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={20} style={{ color: "#6b6b6b" }} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>{item.product_name}</p>
        {item.lot_name && <p style={{ fontSize: 12, color: "#3c161e", fontWeight: 500 }}>{item.lot_name}</p>}
        <p style={{ fontSize: 13, color: "#6b6b6b" }}>
          {formatPrice(item.product_price)} × {item.quantity}
        </p>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#000000", fontVariantNumeric: "tabular-nums" }}>
        {formatPrice(item.line_total)}
      </p>
    </div>
  );
}
