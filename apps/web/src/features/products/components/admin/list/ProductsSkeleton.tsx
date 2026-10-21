const STAT_PLACEHOLDERS = [1, 2, 3, 4];
const ROW_PLACEHOLDERS = [1, 2, 3, 4, 5, 6];
const BLOCK = "animate-pulse bg-[var(--som-surface)]";

export function ProductsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Chargement des produits"
      className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-8 lg:px-10 lg:pt-10"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--som-border)] pb-6 lg:mb-10">
        <div>
          <div className={`mb-3 h-3 w-20 ${BLOCK}`} />
          <div className={`mb-2 h-7 w-40 ${BLOCK}`} />
          <div className={`h-4 w-56 ${BLOCK}`} />
        </div>
        <div className={`h-10 w-44 ${BLOCK}`} />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STAT_PLACEHOLDERS.map((i) => (
          <div key={i} className="h-[118px] border border-[var(--som-border)] bg-white p-5">
            <div className={`h-3 w-20 ${BLOCK}`} />
            <div className={`mt-4 h-7 w-12 ${BLOCK}`} />
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className={`h-11 sm:w-[360px] ${BLOCK}`} />
        <div className={`h-11 sm:w-[200px] ${BLOCK}`} />
        <div className={`h-11 sm:w-[200px] ${BLOCK}`} />
      </div>

      <div className="border border-[var(--som-border)] bg-white">
        {ROW_PLACEHOLDERS.map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-[var(--som-border)] px-5 py-4 last:border-b-0 lg:px-6"
          >
            <div className={`h-[70px] w-14 shrink-0 ${BLOCK}`} />
            <div className="flex-1">
              <div className={`mb-2 h-4 w-1/2 max-w-[260px] ${BLOCK}`} />
              <div className={`h-3 w-1/4 max-w-[120px] ${BLOCK}`} />
            </div>
            <div className={`hidden h-6 w-24 md:block ${BLOCK}`} />
            <div className={`hidden h-10 w-32 md:block ${BLOCK}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
