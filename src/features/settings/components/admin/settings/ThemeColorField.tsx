import { Field } from "./Field";
import { inputClass } from "./styles";

type ThemeColorFieldProps = {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
};

export function ThemeColorField({ label, hint, value, onChange }: ThemeColorFieldProps) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-12 h-12 border border-[var(--som-border-input)] hover:border-[var(--som-border-input-hover)] cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} flex-1 font-mono text-sm`}
        />
      </div>
    </Field>
  );
}
