const STAT_PLACEHOLDERS = [1, 2, 3, 4];
const CARD_PLACEHOLDERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function ProductsSkeleton() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-32 bg-[#fafafa] animate-pulse mb-2" />
          <div className="h-4 w-48 bg-[#fafafa] animate-pulse" />
        </div>
        <div className="h-11 w-40 bg-[#fafafa] animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" style={{ maxWidth: 800 }}>
        {STAT_PLACEHOLDERS.map((i) => (
          <div key={i} className="bg-[#fafafa] border border-[#511f29]/10 animate-pulse" style={{ height: 80 }} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] max-w-md h-11 bg-[#fafafa] animate-pulse" />
        <div className="h-11 w-48 bg-[#fafafa] animate-pulse" />
        <div className="h-11 w-40 bg-[#fafafa] animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CARD_PLACEHOLDERS.map((i) => (
          <div key={i} className="bg-[#fafafa] animate-pulse">
            <div className="aspect-square bg-[#eeeeec]" />
            <div className="p-3">
              <div className="h-4 w-3/4 bg-[#eeeeec] mb-2" />
              <div className="h-3 w-1/2 bg-[#eeeeec] mb-2" />
              <div className="h-4 w-2/3 bg-[#eeeeec]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
