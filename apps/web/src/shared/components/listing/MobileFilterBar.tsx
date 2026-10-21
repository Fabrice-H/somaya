"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { FilterChip } from "./types";

export function MobileFilterBar({ count, chips, onOpen }: { count: number; chips: FilterChip[]; onOpen: () => void }) {
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
