import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "burgundy" | "peach" | "green" | "blue";
}

const colorClasses = {
  burgundy: "bg-[#511F29]/10 text-[#511F29]",
  peach: "bg-[#fcd3b4]/30 text-[#c27a4a]",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "burgundy",
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#511F29]/60">{title}</p>
          <p className="text-2xl font-semibold text-[#511F29] mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#511F29]/50 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={clsx(
                "text-xs mt-2 font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% vs hier
            </p>
          )}
        </div>
        <div className={clsx("p-3 rounded-lg", colorClasses[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
