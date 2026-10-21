import { COLLECTION_COLORS } from "../../../constants";

type ColorSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  ariaLabel?: string;
};

export function ColorSelect({ id, value, onChange, className, ariaLabel }: ColorSelectProps) {
  return (
    <select
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={className}
    >
      {COLLECTION_COLORS.map((color) => (
        <option key={color.value} value={color.value}>
          {color.label}
        </option>
      ))}
    </select>
  );
}
