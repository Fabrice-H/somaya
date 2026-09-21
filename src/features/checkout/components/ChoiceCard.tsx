type ChoiceCardProps = {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

export function ChoiceCard({
  name,
  value,
  checked,
  disabled,
  onChange,
  icon,
  title,
  description,
  aside,
  children,
}: ChoiceCardProps) {
  return (
    <label
      className={`flex gap-4 border p-5 transition-colors md:p-6 ${
        disabled
          ? "cursor-not-allowed border-[var(--som-border)] opacity-60"
          : checked
            ? "cursor-pointer border-[var(--som-ink)] bg-[var(--som-surface-alt)]"
            : "cursor-pointer border-[var(--som-border)] hover:border-[var(--som-border-strong)]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--som-primary)] disabled:cursor-not-allowed"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-4">
          <span className="flex items-center gap-2.5 text-[15px] text-[var(--som-ink)]">
            <span aria-hidden className="text-[var(--som-gray)]">
              {icon}
            </span>
            {title}
          </span>
          {aside && <span className="shrink-0 text-[14px] tabular-nums">{aside}</span>}
        </span>
        {description && <span className="mt-1 block text-[13px] font-light text-[#4a4a4a]">{description}</span>}
        {children}
      </span>
    </label>
  );
}
