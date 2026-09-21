import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface StatusRowProps {
  title: string;
  description: string;
  bordered?: boolean;
  children: ReactNode;
}

export function StatusRow({ title, description, bordered = true, children }: StatusRowProps) {
  return (
    <div
      className="flex items-center justify-between py-6"
      style={bordered ? { borderBottom: "1px solid rgba(81, 31, 41, 0.1)" } : undefined}
    >
      <div>
        <h4 className="text-base font-semibold text-[#000000] mb-1">{title}</h4>
        <p className="text-sm text-[#6b6b6b]">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface StatusToggleProps {
  checked: boolean;
  onToggle: () => void;
}

export function StatusToggle({ checked, onToggle }: StatusToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="w-7 h-7 flex items-center justify-center border-2 transition-all"
      style={{
        borderColor: checked ? "#000000" : "rgba(81, 31, 41, 0.3)",
        background: checked ? "#000000" : "transparent",
      }}
    >
      {checked && <Check size={16} className="text-white" strokeWidth={3} />}
    </button>
  );
}
