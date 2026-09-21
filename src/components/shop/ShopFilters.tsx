"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

// Shared building blocks for listing pages (/catalogue, /lots):
// top bar, sidebar filter groups, mobile drawer, empty state.

// ============================================================
// Top bar: breadcrumb + title on the left, count + sort on the right
// ============================================================

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

// ============================================================
// Mobile toolbar: "Filtrer" button + removable chips
// ============================================================

export type FilterChip = { key: string; label: string; onRemove: () => void };

export function MobileFilterBar({
  count,
  chips,
  onOpen,
}: {
  count: number;
  chips: FilterChip[];
  onOpen: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="-ml-1 inline-flex min-h-11 cursor-pointer items-center gap-2 px-1 text-[12px] uppercase tracking-[0.16em] text-[var(--som-ink)]"
      >
        <SlidersHorizontal size={16} strokeWidth={1.4} aria-hidden />
        Filtrer
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--som-primary)] px-1 text-[10px] tabular-nums text-white">
            {count}
          </span>
        )}
      </button>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Retirer le filtre ${chip.label}`}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--som-primary-50)] px-3 text-[12px] text-[var(--som-primary)]"
        >
          {chip.label}
          <X size={13} strokeWidth={1.6} aria-hidden />
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Sidebar pieces
// ============================================================

export function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--som-border)] py-6 first:pt-0 last:border-b-0">
      <h2 className="m-0 mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">{title}</h2>
      {children}
    </div>
  );
}

// Text option with a burgundy dash when selected
export function OptionButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex min-h-9 w-full cursor-pointer items-center gap-2 text-left text-[14px] transition-colors ${
        active ? "text-[var(--som-ink)]" : "font-light text-[#555] hover:text-[var(--som-ink)]"
      }`}
    >
      <span
        aria-hidden
        className={`h-px bg-[var(--som-primary)] transition-[width] duration-300 ${active ? "w-4" : "w-0 group-hover:w-2"}`}
      />
      <span className="flex-1">{children}</span>
      {count !== undefined && <span className="text-[12px] text-[#9a9a9a] tabular-nums">{count}</span>}
    </button>
  );
}

export function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-[14px] font-light text-[#555]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[var(--som-primary)]"
      />
      {label}
    </label>
  );
}

// Sticky sidebar (desktop) wrapper
export function FilterSidebar({
  children,
  canClear,
  onClear,
}: {
  children: React.ReactNode;
  canClear: boolean;
  onClear: () => void;
}) {
  return (
    <aside aria-label="Filtres" className="hidden lg:block">
      <div className="sticky top-24">
        {children}
        {canClear && (
          <button type="button" onClick={onClear} className="btn-link mt-8">
            Tout effacer
          </button>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// Filter drawer (mobile / tablet)
// ============================================================

export function FilterDrawer({
  open,
  onClose,
  resultCount,
  onClear,
  children,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  onClear: () => void;
  children: React.ReactNode;
}) {
  // Escape closes, page scroll locked while open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[80] lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        className={`absolute bottom-0 right-0 top-0 flex w-full max-w-[400px] flex-col bg-white transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--som-border)] px-6">
          <h2 id="filter-title" className="m-0 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">
            Filtres
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
          >
            <X size={20} strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        <div className="flex gap-3 border-t border-[var(--som-border)] p-6">
          <button type="button" onClick={onClear} className="btn-secondary flex-1 px-4">
            Effacer
          </button>
          <button type="button" onClick={onClose} className="btn-primary flex-[2] px-4">
            Voir {resultCount} article{resultCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Empty results panel
// ============================================================

export type EmptySuggestion = { key: string; label: string; count: number; onClick: () => void };

export function EmptyResults({
  activeLabels,
  suggestions,
  onClearAll,
  clearLabel,
  recommendations,
}: {
  activeLabels: string[];
  suggestions: EmptySuggestion[];
  onClearAll: () => void;
  clearLabel: string;
  /** Rendered under "Vous aimerez aussi" */
  recommendations?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col items-center bg-[var(--som-primary-50)] px-6 py-14 text-center md:px-12 md:py-16">
        <Image src="/images/logo_mark.png" alt="" width={330} height={291} className="h-9 w-auto opacity-80" />
        <h2 className="m-0 mt-6 text-[20px] font-medium text-[var(--som-ink)] md:text-[22px]">
          Aucune pièce ne correspond
        </h2>
        <p className="mx-auto mt-2 max-w-[440px] text-[14px] font-light leading-relaxed text-[#4a4a4a]">
          {activeLabels.length > 0 ? (
            <>
              Rien pour <span className="font-normal text-[var(--som-ink)]">{activeLabels.join(" · ")}</span> pour le
              moment. Nos pièces arrivent régulièrement.
            </>
          ) : (
            "Nos pièces arrivent régulièrement, revenez bientôt."
          )}
        </p>

        {suggestions.length > 0 && (
          <ul className="m-0 mt-7 flex list-none flex-wrap justify-center gap-2 p-0">
            {[...suggestions]
              .sort((a, b) => b.count - a.count)
              .map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={s.onClick}
                    className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[var(--som-primary-200)] bg-white px-4 text-[13px] text-[var(--som-ink)] transition-colors hover:border-[var(--som-primary)]"
                  >
                    <span className="text-[var(--som-gray)]">Retirer</span> {s.label}
                    <span className="text-[12px] text-[var(--som-primary)] tabular-nums">
                      · {s.count} pièce{s.count > 1 ? "s" : ""}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}

        <button type="button" onClick={onClearAll} className="btn-primary mt-8">
          {clearLabel}
        </button>
      </div>

      {recommendations && (
        <section aria-labelledby="empty-reco" className="mt-14 md:mt-16">
          <h2
            id="empty-reco"
            className="m-0 mb-6 text-[12px] font-medium uppercase tracking-[0.24em] text-[var(--som-ink)] md:mb-8"
          >
            Vous aimerez aussi
          </h2>
          {recommendations}
        </section>
      )}
    </div>
  );
}
