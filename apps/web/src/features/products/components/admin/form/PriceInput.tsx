interface PriceInputProps {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function PriceInput({ id, value, onChange, required, placeholder = "0" }: PriceInputProps) {
  return (
    <div className="input-group-som">
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={0}
        max={100000000}
        placeholder={placeholder}
        className="input-som !pl-4 tabular-nums"
      />
      <span className="!pl-0 !pr-4 text-[11px] uppercase tracking-[0.16em]">FCFA</span>
    </div>
  );
}
