type TabsProps<T extends string> = {
  items: readonly { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function Tabs<T extends string>({ items, value, onChange, label }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-7 overflow-x-auto border-b border-[var(--som-border)]">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`relative flex h-12 shrink-0 cursor-pointer items-center gap-2 text-[12px] uppercase tracking-[0.16em] transition-colors ${
              active ? "text-[var(--som-ink)]" : "text-[var(--som-gray)] hover:text-[var(--som-ink)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="text-[11px] tabular-nums text-[#9a9a9a]">{item.count}</span>}
            <span
              aria-hidden
              className={`absolute bottom-[-1px] left-0 h-[2px] w-full bg-[var(--som-primary)] transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
