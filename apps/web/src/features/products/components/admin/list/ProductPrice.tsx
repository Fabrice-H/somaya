import { formatPrice } from "@/shared/lib/format";

export function ProductPrice({ price, oldPrice }: { price: number; oldPrice: number | null }) {
  return (
    <span className="inline-flex flex-col tabular-nums">
      <span className="whitespace-nowrap text-[var(--som-ink)]">{formatPrice(price)}</span>
      {oldPrice && (
        <span className="whitespace-nowrap text-[12px] font-light text-[var(--som-gray)] line-through">
          {formatPrice(oldPrice)}
        </span>
      )}
    </span>
  );
}
