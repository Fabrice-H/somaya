import clsx from "clsx";
import type { ReactNode } from "react";
import type { HeroLayout } from "../../../types";
import { panelClass } from "./styles";

const LAYOUT_OPTIONS: { value: HeroLayout; label: string; description: string; preview: ReactNode }[] = [
  {
    value: "split",
    label: "Split",
    description: "Texte à gauche, média à droite",
    preview: (
      <div className="flex h-12 gap-1">
        <div className="flex-1 bg-[#511f29] rounded-sm flex items-center justify-center">
          <div className="w-6 h-1 bg-[#f1e1e5] rounded" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-sm" />
      </div>
    ),
  },
  {
    value: "centered",
    label: "Centré",
    description: "Texte centré sur le média",
    preview: (
      <div className="h-12 bg-gray-200 rounded-sm relative">
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-8 h-1 bg-white rounded" />
        </div>
      </div>
    ),
  },
  {
    value: "fullwidth",
    label: "Plein écran",
    description: "Média avec texte en bas",
    preview: (
      <div className="h-12 bg-gray-200 rounded-sm relative">
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/60 to-transparent flex items-end pb-1 pl-2">
          <div className="w-6 h-0.5 bg-white rounded" />
        </div>
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
    <div className={panelClass}>
      <h2 className="text-lg font-semibold text-[#000000] mb-2">Choisir la disposition</h2>
      <p className="text-sm text-[#4a4a4a] mb-6">Sélectionnez comment le contenu sera affiché sur le hero banner</p>

      <div className="grid grid-cols-3 gap-4">
        {LAYOUT_OPTIONS.map((layout) => (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(layout.value)}
            className={clsx(
              "p-4 border-2 rounded-xl text-left transition-all",
              value === layout.value
                ? "border-[#511f29] bg-[#511f29]/5 ring-2 ring-[#511f29]/20"
                : "border-gray-200 hover:border-[#511f29]/30"
            )}
          >
            <div className="mb-3">{layout.preview}</div>
            <div className="font-semibold text-[#000000]">{layout.label}</div>
            <div className="text-xs text-[#4a4a4a] mt-1">{layout.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
