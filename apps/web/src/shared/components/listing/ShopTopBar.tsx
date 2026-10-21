import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function ShopTopBar<T extends string>({
  crumb,
  title,
  count,
  sortValue,
  sortOptions,
  onSortChange,
}: {
  crumb: string;
  title: string;
  count: number;
  sortValue: T;
  sortOptions: { value: T; label: string }[];
  onSortChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-[var(--som-border)] pb-5 pt-8 md:pb-6 md:pt-12">
      <div>
        <nav aria-label="Fil d'Ariane" className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
          <Link href="/" className="transition-colors hover:text-[var(--som-primary)]">
            Accueil
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-[var(--som-ink)]">{crumb}</span>
        </nav>
        <h1
          className="m-0 text-[24px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[30px]"
          style={{ lineHeight: 1.15 }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <p className="m-0 text-[12px] text-[var(--som-gray)] tabular-nums" aria-live="polite">
          {count} article{count !== 1 ? "s" : ""}
        </p>
        <label className="relative inline-flex items-center">
          <span className="sr-only">Trier par</span>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value as T)}
            className="min-h-11 cursor-pointer appearance-none bg-transparent pr-6 text-[12px] uppercase tracking-[0.16em] text-[var(--som-ink)] outline-none focus-visible:underline"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute right-0" />
        </label>
      </div>
    </div>
  );
}
