import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { DASHBOARD_PERIOD_DAYS } from "../constants";
import type { DashboardStats } from "../types";

export function ChannelSplit({ channels }: { channels: DashboardStats["channels"] }) {
  const total = channels.whatsapp + channels.online;
  const rows = [
    { label: "Via WhatsApp", value: channels.whatsapp, color: "bg-[var(--som-primary)]" },
    { label: "Payées en ligne", value: channels.online, color: "bg-[var(--som-accent)]" },
  ];
  return (
    <AdminCard title="Canal des commandes" description={`${DASHBOARD_PERIOD_DAYS} derniers jours`}>
      {total === 0 ? (
        <p className="m-0 text-[13px] font-light text-[var(--som-gray)]">Aucune commande sur la période.</p>
      ) : (
        <ul className="m-0 list-none space-y-4 p-0">
          {rows.map((row) => {
            const share = Math.round((row.value / total) * 100);
            return (
              <li key={row.label}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[var(--som-ink)]">{row.label}</span>
                  <span className="tabular-nums text-[var(--som-gray)]">
                    {row.value} · {share}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-[var(--som-surface)]">
                  <div className={`h-full ${row.color}`} style={{ width: `${share}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}
