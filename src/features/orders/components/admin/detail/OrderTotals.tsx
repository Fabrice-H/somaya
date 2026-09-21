import { formatPrice } from "@/shared/lib/format";
import type { OrderDetail } from "../../../types";

type OrderTotalsProps = Pick<OrderDetail, "subtotal" | "delivery_fee" | "total">;

export function OrderTotals({ subtotal, delivery_fee, total }: OrderTotalsProps) {
  return (
    <dl className="m-0 space-y-2.5 border-t border-[var(--som-border)] bg-[var(--som-surface-alt)] px-5 py-5 lg:px-6">
      <div className="flex justify-between text-[14px] font-light text-[var(--som-gray)]">
        <dt>Sous-total</dt>
        <dd className="m-0 tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-[14px] font-light text-[var(--som-gray)]">
        <dt>Livraison</dt>
        <dd className="m-0 tabular-nums">{formatPrice(delivery_fee)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-[var(--som-border)] pt-3 text-[var(--som-ink)]">
        <dt className="text-[13px] font-medium uppercase tracking-[0.14em]">Total</dt>
        <dd className="m-0 text-[18px] font-medium tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
