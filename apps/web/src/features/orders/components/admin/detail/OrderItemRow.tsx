import Image from "next/image";
import { Package } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import type { OrderItem } from "../../../types";

export function OrderItemRow({ item }: { item: OrderItem }) {
  return (
    <li className="flex items-center gap-4 border-b border-[var(--som-border)] px-5 py-4 last:border-b-0 lg:px-6">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[var(--som-primary-50)]">
        {item.product_image ? (
          <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--som-primary)]">
            <Package size={18} strokeWidth={1.4} aria-hidden />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-[14px] font-medium text-[var(--som-ink)]">{item.product_name}</p>
        {item.lot_name && (
          <p className="m-0 mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[var(--som-primary)]">
            {item.lot_name}
          </p>
        )}
        <p className="m-0 mt-1 text-[13px] font-light tabular-nums text-[var(--som-gray)]">
          {formatPrice(item.product_price)} × {item.quantity}
        </p>
      </div>
      <p className="m-0 shrink-0 text-[14px] font-medium tabular-nums text-[var(--som-ink)]">
        {formatPrice(item.line_total)}
      </p>
    </li>
  );
}
