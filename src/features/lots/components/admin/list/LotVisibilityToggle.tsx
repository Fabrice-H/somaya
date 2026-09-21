import clsx from "clsx";

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
      className={clsx("relative w-12 h-6 rounded-full transition-colors", active ? "bg-emerald-500" : "bg-gray-300")}
      aria-label={active ? "Désactiver" : "Activer"}
    >
      <span
        className={clsx(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
          active ? "right-1" : "left-1"
        )}
      />
    </button>
  );
}
