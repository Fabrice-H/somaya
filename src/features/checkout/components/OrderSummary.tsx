import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import { cartLineKey, itemVariant, lineTotal } from "@/features/cart/utils";
import type { CartItem } from "@/features/cart/store";
import { formatPrice } from "@/shared/lib/format";

type OrderSummaryProps = {
  items: CartItem[];
  deliveryFee: number;
  isPending: boolean;
  error: string | null;
};

export function OrderSummary({ items, deliveryFee, isPending, error }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside aria-labelledby="summary-title" className="bg-[var(--som-primary-50)] p-6 md:p-8 lg:sticky lg:top-8">
      <h2 id="summary-title" className="m-0 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">
        Votre commande <span className="text-[var(--som-gray)] tabular-nums">({count})</span>
      </h2>

      <ul className="m-0 mt-5 flex max-h-[340px] list-none flex-col gap-4 overflow-y-auto p-0">
        {items.map((item) => (
          <li key={cartLineKey(item)} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-white">
              <Image src={item.productImage} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--som-ink)] px-1 text-[10px] tabular-nums text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 line-clamp-2 text-[13px] text-[var(--som-ink)]">{item.productName}</p>
              {itemVariant(item) && <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">{itemVariant(item)}</p>}
            </div>
            <p className="m-0 shrink-0 text-[13px] tabular-nums text-[var(--som-ink)]">{formatPrice(lineTotal(item))}</p>
          </li>
        ))}
      </ul>

      <dl className="m-0 mt-6 flex flex-col gap-2 border-t border-[var(--som-primary-100)] pt-5 text-[14px]">
        <div className="flex justify-between">
          <dt className="font-light text-[#4a4a4a]">Sous-total</dt>
          <dd className="m-0 tabular-nums text-[var(--som-ink)]">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-light text-[#4a4a4a]">Livraison</dt>
          <dd className="m-0 tabular-nums text-[var(--som-ink)]">{deliveryFee > 0 ? formatPrice(deliveryFee) : "Offerte"}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-[var(--som-primary-100)] pt-4">
          <dt className="text-[12px] uppercase tracking-[0.18em] text-[var(--som-ink)]">Total</dt>
          <dd className="m-0 text-[22px] tabular-nums text-[var(--som-ink)]">{formatPrice(subtotal + deliveryFee)}</dd>
        </div>
      </dl>

      {error && (
        <p role="alert" className="m-0 mt-5 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)]">
          {error}
        </p>
      )}

      <button type="submit" form="checkout-form" disabled={isPending} className="btn-primary mt-6 w-full">
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            Envoi en cours…
          </>
        ) : (
          "Confirmer la commande"
        )}
      </button>
      <p className="m-0 mt-4 flex items-center justify-center gap-2 text-[12px] font-light text-[var(--som-gray)]">
        <ShieldCheck size={15} strokeWidth={1.4} aria-hidden className="text-[var(--som-primary)]" />
        Prix vérifiés et paiement à la réception
      </p>
    </aside>
  );
}
