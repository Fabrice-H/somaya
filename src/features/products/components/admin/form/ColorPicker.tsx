import { Check } from "lucide-react";
import { COLORS } from "@/features/products/constants";

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const known = new Set<string>(COLORS.map((color) => color.value));
  const options = [
    ...COLORS,
    ...value.filter((color) => !known.has(color)).map((color) => ({ value: color, label: color })),
  ];

  const toggle = (color: string) =>
    onChange(value.includes(color) ? value.filter((item) => item !== color) : [...value, color]);

  return (
    <div role="group" aria-label="Couleurs disponibles" className="flex flex-wrap gap-2">
      {options.map(({ value: color, label }) => {
        const selected = value.includes(color);
        return (
          <button
            key={color}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(color)}
            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 border px-3.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--som-primary)] ${
              selected
                ? "border-[var(--som-primary)] bg-[var(--som-primary-50)] text-[var(--som-primary)]"
                : "border-[var(--som-border)] bg-white text-[var(--som-ink)] hover:border-[var(--som-border-strong)]"
            }`}
          >
            {selected && <Check size={14} strokeWidth={1.5} aria-hidden />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
