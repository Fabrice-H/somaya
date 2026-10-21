import { Search, X } from "lucide-react";

interface OrderSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function OrderSearchInput({ value, onChange, onClear }: OrderSearchInputProps) {
  return (
    <label className="input-group-som w-full md:max-w-[380px] md:flex-1">
      <span>
        <Search size={16} strokeWidth={1.5} aria-hidden />
      </span>
      <span className="sr-only">Rechercher une commande</span>
      <input
        type="text"
        placeholder="Nom, téléphone, n° de commande…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-som"
      />
      {value && (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={onClear}
          className="flex w-11 shrink-0 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
        >
          <X size={15} strokeWidth={1.5} aria-hidden />
        </button>
      )}
    </label>
  );
}
