interface SwitchRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export function SwitchRow({ id, title, description, checked, onToggle }: SwitchRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[var(--som-border)] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p id={`${id}-label`} className="m-0 text-[14px] font-medium text-[var(--som-ink)]">
          {title}
        </p>
        <p id={`${id}-hint`} className="m-0 mt-0.5 text-[13px] font-light text-[var(--som-gray)]">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        onClick={onToggle}
        className="group flex h-10 shrink-0 cursor-pointer items-center focus-visible:outline-none"
      >
        <span
          className={`relative flex h-6 w-11 items-center border p-[3px] transition-colors group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--som-primary)] ${
            checked
              ? "border-[var(--som-primary)] bg-[var(--som-primary)]"
              : "border-[var(--som-border-strong)] bg-[var(--som-surface)]"
          }`}
        >
          <span
            className={`block h-4 w-4 transition-transform duration-200 ${
              checked ? "translate-x-5 bg-white" : "translate-x-0 bg-white shadow-[0_0_0_1px_var(--som-border-strong)]"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
