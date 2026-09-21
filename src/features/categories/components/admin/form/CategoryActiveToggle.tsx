type CategoryActiveToggleProps = {
  active: boolean;
  onToggle: () => void;
};

export function CategoryActiveToggle({ active, onToggle }: CategoryActiveToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${active ? "bg-green-500" : "bg-[#6b6b6b]"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? "left-7" : "left-1"}`}
        />
      </button>
      <span className="text-sm text-[#000000]">{active ? "Catégorie active" : "Catégorie inactive"}</span>
    </div>
  );
}
