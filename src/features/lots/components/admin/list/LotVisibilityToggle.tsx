type LotVisibilityToggleProps = {
  active: boolean;
  onToggle: () => void;
};

export function LotVisibilityToggle({ active, onToggle }: LotVisibilityToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      aria-label={active ? "Désactiver" : "Activer"}
      className="inline-flex h-10 cursor-pointer items-center gap-3"
    >
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
      <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--som-gray)]">
        {active ? "En ligne" : "Masqué"}
      </span>
    </button>
  );
}
