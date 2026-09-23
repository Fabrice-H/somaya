import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { formatPrice } from "@/shared/lib/format";
import { DASHBOARD_CHART_DAYS } from "../constants";
import type { DailyPoint } from "../types";

const shortDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export function RevenueChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(1, ...daily.map((point) => point.revenue));
  const total = daily.reduce((sum, point) => sum + point.revenue, 0);
  const ordersTotal = daily.reduce((sum, point) => sum + point.orders, 0);

  return (
    <AdminCard
      title="Ventes par jour"
      description={`${DASHBOARD_CHART_DAYS} derniers jours · ${formatPrice(total)} · ${ordersTotal} commande${ordersTotal > 1 ? "s" : ""} (hors annulées)`}
    >
      <div className="flex h-44 items-end gap-1.5">
        {daily.map((point) => {
          const height = Math.round((point.revenue / max) * 100);
          return (
            <div key={point.day} className="group relative flex h-full flex-1 flex-col justify-end">
              <div
                className={`w-full transition-colors ${point.revenue > 0 ? "bg-[var(--som-primary)] group-hover:bg-[var(--som-primary-hover)]" : "bg-[var(--som-surface)]"}`}
                style={{ height: `${Math.max(height, point.revenue > 0 ? 6 : 2)}%` }}
                aria-label={`${shortDay.format(new Date(point.day))} : ${formatPrice(point.revenue)}, ${point.orders} commande${point.orders > 1 ? "s" : ""}`}
                role="img"
              />
              <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-[var(--som-ink)] px-2 py-1 text-[10px] text-white group-hover:block">
                {formatPrice(point.revenue)} · {point.orders}
              </span>
            </div>
          );
        })}
      </div>
      {daily.length > 0 && (
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--som-gray)]">
          <span>{shortDay.format(new Date(daily[0].day))}</span>
          <span>{shortDay.format(new Date(daily[daily.length - 1].day))}</span>
        </div>
      )}
    </AdminCard>
  );
}
