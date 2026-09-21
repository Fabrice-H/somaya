const cardStyle = { border: "1px solid rgba(81, 31, 41, 0.1)", padding: 24 };

export function HeroBannerSkeleton() {
  return (
    <div>
      <div
        className="flex items-center justify-between gap-4 bg-[#fafafa] border-b border-[#511f29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#eeeeec] animate-pulse" />
          <div>
            <div className="h-6 w-40 bg-[#eeeeec] animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[#eeeeec] animate-pulse" />
          </div>
        </div>
        <div className="h-11 w-32 bg-[#eeeeec] animate-pulse" />
      </div>

      <div style={{ padding: "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1200 }}>
          <div className="space-y-6">
            <div className="bg-white animate-pulse" style={{ ...cardStyle, height: 200 }} />
            <div className="bg-white animate-pulse" style={{ ...cardStyle, height: 400 }} />
          </div>
          <div className="bg-white animate-pulse" style={{ ...cardStyle, height: 500 }} />
        </div>
      </div>
    </div>
  );
}
