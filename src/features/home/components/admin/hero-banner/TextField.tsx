import clsx from "clsx";
import { fieldClass, labelClass } from "./styles";

type TextFieldProps = {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
};

export function TextField({ label, value, onChange, placeholder, className, multiline }: TextFieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={clsx(fieldClass, "resize-none", className)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={clsx(fieldClass, className)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
