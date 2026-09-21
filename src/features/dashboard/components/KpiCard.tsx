import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { KPI_COLOR_CLASSES } from "../constants";
import type { KpiColor } from "../types";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: KpiColor;
}

export function KpiCard({ title, value, subtitle, icon: Icon, color = "burgundy" }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#3c161e]/60">{title}</p>
          <p className="text-2xl font-semibold text-[#3c161e] mt-1">{value}</p>
          {subtitle && <p className="text-xs text-[#3c161e]/50 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx("p-3 rounded-lg", KPI_COLOR_CLASSES[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
