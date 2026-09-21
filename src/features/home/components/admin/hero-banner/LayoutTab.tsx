import type { ReactNode } from "react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { HeroLayout } from "../../../types";

const LAYOUT_OPTIONS: { value: HeroLayout; label: string; description: string; preview: ReactNode }[] = [
  {
    value: "split",
    label: "Split",
    description: "Texte à gauche, média à droite",
    preview: (
      <div className="flex h-14 gap-px">
        <div className="flex flex-1 flex-col justify-center gap-1 bg-[var(--som-primary-50)] px-2">
          <div className="h-1 w-8 bg-[var(--som-ink)]" />
          <div className="h-1 w-5 bg-[var(--som-primary)]" />
        </div>
        <div className="flex-1 bg-[var(--som-primary-100)]" />
      </div>
    ),
  },
  {
    value: "centered",
    label: "Centré",
    description: "Texte centré sur le média",
    preview: (
      <div className="flex h-14 flex-col items-center justify-center gap-1 bg-[var(--som-border-strong)]">
        <div className="h-1 w-8 bg-white" />
        <div className="h-1 w-5 bg-white/70" />
      </div>
    ),
  },
  {
    value: "fullwidth",
    label: "Plein écran",
    description: "Média avec texte en bas",
    preview: (
      <div className="flex h-14 flex-col justify-end gap-1 bg-[var(--som-border-strong)] p-2">
        <div className="h-1 w-8 bg-white" />
        <div className="h-1 w-5 bg-white/70" />
      </div>
    ),
  },
];

type LayoutTabProps = {
  value: string;
  onChange: (layout: HeroLayout) => void;
};

export function LayoutTab({ value, onChange }: LayoutTabProps) {
  return (
    <AdminCard title="Disposition" description="Comment le contenu est agencé dans le hero.">
      <div role="group" aria-label="Disposition" className="grid gap-3 sm:grid-cols-3">
        {LAYOUT_OPTIONS.map((layout) => {
          const selected = value === layout.value;
          return (
            <button
              key={layout.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(layout.value)}
              className={`cursor-pointer border p-3 text-left transition-colors ${
                selected
                  ? "border-[var(--som-primary)] bg-[var(--som-primary-50)]"
                  : "border-[var(--som-border)] bg-white hover:border-[var(--som-border-strong)]"
              }`}
            >
              {layout.preview}
              <span
                className={`mt-3 block text-[12px] uppercase tracking-[0.16em] ${
                  selected ? "text-[var(--som-primary)]" : "text-[var(--som-ink)]"
                }`}
              >
                {layout.label}
              </span>
              <span className="mt-1 block text-[12px] font-light text-[var(--som-gray)]">{layout.description}</span>
            </button>
          );
        })}
      </div>
    </AdminCard>
  );
}
