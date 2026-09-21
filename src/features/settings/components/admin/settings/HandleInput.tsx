import { inputClass } from "./styles";

type HandleInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function HandleInput({ value, onChange, placeholder }: HandleInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]">@</span>
      <input
        type="text"
        value={value.replace("@", "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
        style={{ paddingLeft: 32 }}
      />
    </div>
  );
}
