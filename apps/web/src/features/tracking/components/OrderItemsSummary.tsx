import Image from "next/image";
import { formatPrice } from "@/shared/lib/format";
import type { AccountOrderDetail } from "@/features/account/types";

export function OrderItemsSummary({ order }: { order: AccountOrderDetail }) {
  return (
    <div className="border border-[var(--som-border)]">
      <ul className="m-0 list-none p-0">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 border-b border-[var(--som-border)] px-5 py-4">
            <span className="relative h-16 w-13 shrink-0 overflow-hidden bg-[var(--som-surface)]">
              {item.product_image && (
                <Image src={item.product_image} alt="" fill sizes="52px" className="object-cover" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[14px] text-[var(--som-ink)]">{item.product_name}</p>
              {item.lot_name && (
                <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">{item.lot_name}</p>
              )}
              <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">Quantité : {item.quantity}</p>
            </div>
            <span className="text-[14px] tabular-nums text-[var(--som-ink)]">{formatPrice(item.line_total)}</span>
          </li>
        ))}
      </ul>
      <dl className="m-0 space-y-2 px-5 py-4 text-[14px]">
        <div className="flex justify-between font-light text-[#4a4a4a]">
          <dt>Sous-total</dt>
          <dd className="m-0 tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between font-light text-[#4a4a4a]">
          <dt>Livraison</dt>
          <dd className="m-0 tabular-nums">{order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : "Offerte"}</dd>
        </div>
        <div className="flex justify-between border-t border-[var(--som-border)] pt-3 font-medium text-[var(--som-ink)]">
          <dt>Total</dt>
          <dd className="m-0 tabular-nums">{formatPrice(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
