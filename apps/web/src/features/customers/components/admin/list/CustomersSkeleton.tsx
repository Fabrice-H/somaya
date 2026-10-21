const STAT_PLACEHOLDERS = [1, 2, 3, 4];
const TAB_PLACEHOLDERS = [1, 2, 3, 4, 5, 6];
const ROW_PLACEHOLDERS = [1, 2, 3, 4, 5, 6];

const BLOCK = "animate-pulse bg-[var(--som-surface)]";

export function CustomersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-8 lg:px-10 lg:pt-10" aria-busy="true">
      <div className="mb-8 border-b border-[var(--som-border)] pb-6 lg:mb-10">
        <div className={`mb-3 h-3 w-16 ${BLOCK}`} />
        <div className={`h-7 w-32 ${BLOCK}`} />
        <div className={`mt-2 h-4 w-80 max-w-full ${BLOCK}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_PLACEHOLDERS.map((i) => (
          <div key={i} className="border border-[var(--som-border)] bg-white p-5 lg:p-6">
            <div className={`h-3 w-20 ${BLOCK}`} />
            <div className={`mt-4 h-7 w-16 ${BLOCK}`} />
          </div>
        ))}
      </div>
      <div className="mt-10 flex h-12 gap-7 overflow-hidden border-b border-[var(--som-border)]">
        {TAB_PLACEHOLDERS.map((i) => (
          <div key={i} className={`my-auto h-3 w-20 shrink-0 ${BLOCK}`} />
        ))}
      </div>
      <div className="mt-6 border border-[var(--som-border)] bg-white">
        <div className="flex flex-wrap gap-3 border-b border-[var(--som-border)] p-5 lg:px-6">
          <div className={`h-[52px] w-full md:w-[320px] ${BLOCK}`} />
          <div className={`h-[52px] w-[240px] ${BLOCK}`} />
        </div>
        {ROW_PLACEHOLDERS.map((i) => (
          <div
            key={i}
            className="flex h-16 items-center gap-6 border-b border-[var(--som-border)] px-5 last:border-b-0 lg:px-6"
          >
            <div className={`h-3 w-40 ${BLOCK}`} />
            <div className={`h-3 flex-1 ${BLOCK}`} />
            <div className={`h-3 w-16 ${BLOCK}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
