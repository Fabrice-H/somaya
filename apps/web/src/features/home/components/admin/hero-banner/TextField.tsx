import { Field } from "@/shared/components/admin/ui/Field";

type TextFieldProps = {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  className?: string;
  multiline?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  className = "",
  multiline,
}: TextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      {multiline ? (
        <textarea
          id={id}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`input-som ${className}`}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={`input-som ${className}`}
          placeholder={placeholder}
        />
      )}
    </Field>
  );
}
