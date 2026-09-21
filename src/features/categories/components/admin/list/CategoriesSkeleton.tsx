export function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 600 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#fafafa] border border-[#511f29]/10 animate-pulse"
            style={{ padding: "16px 20px", height: 80 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-[#fafafa] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
