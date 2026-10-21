export function FilterSidebar({
  children,
  canClear,
  onClear,
}: {
  children: React.ReactNode;
  canClear: boolean;
  onClear: () => void;
}) {
  return (
    <aside aria-label="Filtres" className="hidden lg:block">
      <div className="sticky top-24">
        {children}
        {canClear && (
          <button type="button" onClick={onClear} className="btn-link mt-8">
            Tout effacer
          </button>
        )}
      </div>
    </aside>
  );
}
