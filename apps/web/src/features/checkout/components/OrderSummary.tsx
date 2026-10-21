import Image from "next/image";
import type { CartItem } from "@/features/cart/store";
import { cartLineKey, itemVariant, lineTotal } from "@/features/cart/utils";
import { formatPrice } from "@/shared/lib/format";

type OrderSummaryProps = {
  items: CartItem[];
  deliveryFee: number;
};

export function OrderSummary({ items, deliveryFee }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <aside aria-labelledby="summary-title" className="lg:sticky lg:top-28">
      <h2 id="summary-title" className="m-0 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--som-gray)]">
        Votre commande
      </h2>

      <ul className="m-0 mt-5 flex max-h-[360px] list-none flex-col gap-5 overflow-y-auto p-0">
        {items.map((item) => (
          <li key={cartLineKey(item)} className="flex gap-4">
            <div className="relative h-24 w-[72px] shrink-0 overflow-hidden bg-[var(--som-primary-50)]">
              <Image src={item.productImage} alt="" fill sizes="72px" className="object-cover" />
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--som-ink)] px-1 text-[10px] tabular-nums text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="m-0 line-clamp-2 text-[14px] text-[var(--som-ink)]">{item.productName}</p>
              <div className="mt-auto flex items-end justify-between gap-3">
                <p className="m-0 text-[12px] font-light text-[var(--som-gray)]">{itemVariant(item)}</p>
                <p className="m-0 shrink-0 text-[14px] tabular-nums text-[var(--som-ink)]">
                  {formatPrice(lineTotal(item))}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="m-0 mt-6 flex flex-col gap-2.5 border-t border-[var(--som-border)] pt-5 text-[14px]">
        <div className="flex justify-between">
          <dt className="font-light text-[#4a4a4a]">Sous-total</dt>
          <dd className="m-0 tabular-nums text-[var(--som-ink)]">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-light text-[#4a4a4a]">Livraison</dt>
          <dd className="m-0 tabular-nums text-[var(--som-ink)]">
            {deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratuit"}
          </dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-[var(--som-border)] pt-5">
          <dt className="text-[15px] font-medium text-[var(--som-ink)]">Total</dt>
          <dd className="m-0 text-[24px] font-light tabular-nums text-[var(--som-ink)]">
            {formatPrice(subtotal + deliveryFee)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
