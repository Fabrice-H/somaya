import { Search, X } from "lucide-react";

interface OrderSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function OrderSearchInput({ value, onChange, onClear }: OrderSearchInputProps) {
  return (
    <div className="relative flex-1 min-w-[280px]">
      <Search
        size={18}
        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b6b6b" }}
      />
      <input
        type="text"
        placeholder="Rechercher (nom, téléphone, n° commande...)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus:border-black"
        style={{
          width: "100%",
          height: 44,
          paddingLeft: 44,
          paddingRight: value ? 44 : 16,
          border: "1px solid rgba(81,31,41,0.15)",
          background: "white",
          fontSize: 14,
          color: "#000000",
          outline: "none",
        }}
      />
      {value && (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={onClear}
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#6b6b6b" }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
