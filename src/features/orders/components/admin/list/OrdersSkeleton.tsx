const TAB_PLACEHOLDERS = [1, 2, 3, 4, 5, 6, 7];
const ROW_PLACEHOLDERS = [1, 2, 3, 4, 5];

export function OrdersSkeleton() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <div className="mb-8">
        <div className="h-8 w-32 bg-[#fafafa] animate-pulse mb-2" />
        <div className="h-4 w-48 bg-[#fafafa] animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {TAB_PLACEHOLDERS.map((i) => (
          <div key={i} className="h-8 bg-[#fafafa] animate-pulse" style={{ width: 80 + i * 10 }} />
        ))}
      </div>
      <div
        className="flex flex-wrap items-center gap-3 mb-6"
        style={{ padding: "16px 20px", background: "#fafafa", border: "1px solid rgba(81,31,41,0.1)" }}
      >
        <div className="h-11 flex-1 min-w-[280px] bg-white animate-pulse" />
        <div className="h-11 w-40 bg-white animate-pulse" />
        <div className="h-11 w-40 bg-white animate-pulse" />
      </div>
      <div style={{ background: "white", border: "1px solid rgba(81,31,41,0.1)" }}>
        <div className="h-12 bg-[#fafafa]" style={{ borderBottom: "1px solid rgba(81,31,41,0.1)" }} />
        {ROW_PLACEHOLDERS.map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse"
            style={{
              borderBottom: i < ROW_PLACEHOLDERS.length ? "1px solid rgba(81,31,41,0.1)" : "none",
              background: i % 2 === 0 ? "#fafafa" : "white",
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
