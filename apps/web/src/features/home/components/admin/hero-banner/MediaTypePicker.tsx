import { Film, Image as ImageIcon } from "lucide-react";
import type { HeroMediaType } from "../../../types";

const OPTIONS = [
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Vidéo", icon: Film },
] as const;

type MediaTypePickerProps = {
  value: string;
  onChange: (value: HeroMediaType) => void;
};

export function MediaTypePicker({ value, onChange }: MediaTypePickerProps) {
  return (
    <div role="group" aria-label="Type de média" className="grid grid-cols-2 gap-3">
      {OPTIONS.map(({ value: option, label, icon: Icon }) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`flex min-h-12 cursor-pointer items-center justify-center gap-2.5 border text-[12px] uppercase tracking-[0.16em] transition-colors ${
              selected
                ? "border-[var(--som-primary)] bg-[var(--som-primary-50)] text-[var(--som-primary)]"
                : "border-[var(--som-border)] bg-white text-[var(--som-gray)] hover:border-[var(--som-border-strong)] hover:text-[var(--som-ink)]"
            }`}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
