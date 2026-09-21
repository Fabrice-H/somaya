"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/shared/components/ui/QuantityStepper";
import { formatPrice } from "@/shared/lib/format";
import { useCartStore, type CartItem } from "../store";
import { itemHref, itemVariant, lineTotal, maxQuantity } from "../utils";

export function CartLine({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const variant = itemVariant(item);

  return (
    <li className="flex gap-4 border-b border-[var(--som-border)] py-5 last:border-b-0">
      <Link href={itemHref(item)} onClick={onNavigate} className="relative h-28 w-21 shrink-0 overflow-hidden bg-[var(--som-primary-50)]">
        <Image src={item.productImage} alt={item.productName} fill sizes="84px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={itemHref(item)}
              onClick={onNavigate}
              className="line-clamp-2 text-[14px] text-[var(--som-ink)] transition-opacity hover:opacity-60"
            >
              {item.productName}
            </Link>
            {variant && <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">{variant}</p>}
          </div>
          <p className="m-0 shrink-0 text-[14px] tabular-nums text-[var(--som-ink)]">{formatPrice(lineTotal(item))}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="md"
            value={item.quantity}
            max={maxQuantity(item)}
            onChange={(quantity) => updateQuantity(item.productId, quantity, item.lotId, item.itemId)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.lotId, item.itemId)}
            className="min-h-11 cursor-pointer text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)] underline-offset-4 transition-colors hover:text-[var(--som-ink)] hover:underline"
          >
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}
