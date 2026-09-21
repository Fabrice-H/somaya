export function TestimonialsSkeleton() {
  return (
    <div>
      <div
        className="flex items-center justify-between gap-4 bg-[#fafafa] border-b border-[#511f29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#eeeeec] rounded-lg animate-pulse" />
          <div>
            <div className="h-6 w-32 bg-[#eeeeec] rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[#eeeeec] rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-28 bg-[#eeeeec] rounded-lg animate-pulse" />
      </div>

      <div style={{ padding: "32px 40px" }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ maxWidth: 1200 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg animate-pulse"
              style={{ border: "1px solid rgba(81, 31, 41, 0.1)", padding: 16, height: 180 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
