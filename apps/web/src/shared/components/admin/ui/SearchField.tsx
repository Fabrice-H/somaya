import { Search } from "lucide-react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchField({ value, onChange, placeholder = "Rechercher…", label = "Rechercher" }: SearchFieldProps) {
  return (
    <label className="input-group-som w-full sm:max-w-[320px]">
      <span>
        <Search size={16} strokeWidth={1.5} aria-hidden />
      </span>
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input-som"
      />
    </label>
  );
}
