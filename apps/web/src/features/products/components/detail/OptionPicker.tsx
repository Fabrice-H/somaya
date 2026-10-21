type OptionPickerProps = {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  compact?: boolean;
};

export function OptionPicker({ label, options, value, onChange, compact = false }: OptionPickerProps) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-3 p-0 text-[12px] uppercase tracking-[0.18em] text-[var(--som-ink)]">
        {label}
        {value && !compact && <span className="text-[var(--som-gray)]"> : {value}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={`h-11 cursor-pointer border text-[13px] transition-colors ${compact ? "min-w-14 px-3" : "px-5"} ${
                active
                  ? "border-[var(--som-ink)] bg-[var(--som-ink)] text-white"
                  : "border-[var(--som-border-strong)] bg-white text-[var(--som-ink)] hover:border-[var(--som-ink)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
