import clsx from "clsx";
import { fieldClass } from "./styles";

type ColorFieldProps = {
  label: string;
  value: string | null;
  fallback: string;
  onChange: (value: string) => void;
  hint?: string;
};

export function ColorField({ label, value, fallback, onChange, hint }: ColorFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#000000] mb-3">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value || fallback}
          onChange={(event) => onChange(event.target.value)}
          className="w-16 h-12 cursor-pointer border-2 border-gray-200 rounded-lg"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={clsx(fieldClass, "flex-1 font-mono")}
          placeholder={fallback}
        />
      </div>
      {hint && <p className="text-xs text-[#4a4a4a] mt-2">{hint}</p>}
    </div>
  );
}
