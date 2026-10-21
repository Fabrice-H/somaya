"use client";

import { X } from "lucide-react";
import { useModalBehavior } from "@/shared/hooks/useModalBehavior";

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
  useModalBehavior(open, onClose);

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
          <h2
            id="filter-title"
            className="m-0 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]"
          >
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
