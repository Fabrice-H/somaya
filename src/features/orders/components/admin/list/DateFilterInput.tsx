interface DateFilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateFilterInput({ label, value, onChange }: DateFilterInputProps) {
  return (
    <input
      type="date"
      aria-label={label}
      title={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input-som cursor-pointer md:w-[180px]"
    />
  );
}
