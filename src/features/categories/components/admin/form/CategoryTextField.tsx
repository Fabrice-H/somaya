import type { InputHTMLAttributes, ReactNode } from "react";

type CategoryTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: ReactNode;
};

export function CategoryTextField({ id, label, hint, className = "w-full", ...inputProps }: CategoryTextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#000000] mb-2">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`${className} h-12 px-4 bg-[#fafafa] border border-[var(--som-border-input)] hover:border-[var(--som-border-input-hover)] text-[#000000] text-sm outline-none transition-colors focus:border-black`}
      />
      {hint && <p className="text-xs text-[#6b6b6b] mt-1">{hint}</p>}
    </div>
  );
}
