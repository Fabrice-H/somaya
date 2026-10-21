export function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--som-border)] py-6 first:pt-0 last:border-b-0">
      <h2 className="m-0 mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">{title}</h2>
      {children}
    </div>
  );
}

export function OptionButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex min-h-9 w-full cursor-pointer items-center gap-2 text-left text-[14px] transition-colors ${
        active ? "text-[var(--som-ink)]" : "font-light text-[#555] hover:text-[var(--som-ink)]"
      }`}
    >
      <span
        aria-hidden
        className={`h-px bg-[var(--som-primary)] transition-[width] duration-300 ${active ? "w-4" : "w-0 group-hover:w-2"}`}
      />
      <span className="flex-1">{children}</span>
      {count !== undefined && <span className="text-[12px] text-[#9a9a9a] tabular-nums">{count}</span>}
    </button>
  );
}

export function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-[14px] font-light text-[#555]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[var(--som-primary)]"
      />
      {label}
    </label>
  );
}
