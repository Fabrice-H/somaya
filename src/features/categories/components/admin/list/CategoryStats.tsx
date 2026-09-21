type CategoryStatsProps = {
  total: number;
  withImage: number;
  active: number;
};

export function CategoryStats({ total, withImage, active }: CategoryStatsProps) {
  const stats = [
    { label: "Total", value: total, color: "#3c161e" },
    { label: "Avec image", value: withImage, color: "#A08050" },
    { label: "Actives", value: active, color: "#16a34a" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 600 }}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#fafafa] border border-[#511f29]/10" style={{ padding: "16px 20px" }}>
          <p className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">{stat.label}</p>
          <p className="text-3xl font-semibold tabular-nums" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
