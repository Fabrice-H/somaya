export function CategoriesSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[118px] animate-pulse border border-[var(--som-border)] bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-[var(--som-border)] bg-white">
            <div className="aspect-square animate-pulse bg-[var(--som-surface)]" />
            <div className="h-[92px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
