type CategoryActiveToggleProps = {
  active: boolean;
  onToggle: () => void;
};

export function CategoryActiveToggle({ active, onToggle }: CategoryActiveToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-[14px] text-[var(--som-ink)]">
          {active ? "Catégorie active" : "Catégorie inactive"}
        </span>
        <span className="mt-0.5 block text-[12px] font-light text-[var(--som-gray)]">
          {active ? "Visible dans la boutique" : "Masquée de la boutique"}
        </span>
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 border transition-colors ${
          active ? "border-[var(--som-primary)] bg-[var(--som-primary)]" : "border-[var(--som-border-strong)] bg-white"
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 transition-all ${
            active ? "left-[22px] bg-white" : "left-[3px] bg-[var(--som-border-strong)]"
          }`}
        />
      </span>
    </button>
  );
}
