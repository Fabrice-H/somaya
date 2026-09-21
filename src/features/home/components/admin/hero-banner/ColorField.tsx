import { Field } from "@/shared/components/admin/ui/Field";

type ColorFieldProps = {
  id: string;
  label: string;
  value: string | null;
  fallback: string;
  onChange: (value: string) => void;
  hint?: string;
};

export function ColorField({ id, label, value, fallback, onChange, hint }: ColorFieldProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <div className="flex items-stretch gap-3">
        <input
          type="color"
          value={value || fallback}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} : sélecteur`}
          className="h-[52px] w-[52px] shrink-0 cursor-pointer border border-[var(--som-border-input)] bg-white p-1 transition-colors hover:border-[var(--som-border-input-hover)]"
        />
        <input
          id={id}
          type="text"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="input-som flex-1 font-mono uppercase"
          placeholder={fallback}
        />
      </div>
    </Field>
  );
}
