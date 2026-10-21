import type { InputHTMLAttributes } from "react";
import { Field } from "@/shared/components/admin/ui/Field";

type CategoryTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
};

export function CategoryTextField({
  id,
  label,
  hint,
  required,
  className = "",
  ...inputProps
}: CategoryTextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} required={required}>
      <input id={id} {...inputProps} className={`input-som ${className}`} />
    </Field>
  );
}
