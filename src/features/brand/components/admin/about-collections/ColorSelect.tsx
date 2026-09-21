import { COLLECTION_COLORS } from "../../../constants";

type ColorSelectProps = {
  value: string;
  onChange: (value: string) => void;
  className: string;
};

export function ColorSelect({ value, onChange, className }: ColorSelectProps) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={className}>
      {COLLECTION_COLORS.map((color) => (
        <option key={color.value} value={color.value}>
          {color.label}
        </option>
      ))}
    </select>
  );
}
