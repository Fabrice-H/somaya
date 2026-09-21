import type { ReactNode } from "react";

export const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-black/10 text-[#3c161e]";

interface FormFieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#3c161e]/80 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-[#3c161e]/50">{hint}</p>}
    </div>
  );
}
