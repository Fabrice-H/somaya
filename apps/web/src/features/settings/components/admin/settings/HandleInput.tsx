type HandleInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function HandleInput({ id, value, onChange, placeholder }: HandleInputProps) {
  return (
    <div className="input-group-som">
      <span aria-hidden>@</span>
      <input
        id={id}
        type="text"
        value={value.replace("@", "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input-som"
      />
    </div>
  );
}
