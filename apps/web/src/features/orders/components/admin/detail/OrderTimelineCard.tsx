import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { formatOrderDateShort } from "../../../utils";
import type { OrderDetail } from "../../../types";
import { OrderStatusBadge } from "../OrderStatusBadge";

function TimelineEvent({ label, date, active = false }: { label: string; date: string; active?: boolean }) {
  return (
    <li className="relative pb-5 pl-6 last:pb-0">
      <span
        aria-hidden
        className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${
          active ? "bg-[var(--som-primary)]" : "bg-[var(--som-border-strong)]"
        }`}
      />
      <p className="m-0 text-[14px] text-[var(--som-ink)]">{label}</p>
      <p className="m-0 mt-0.5 text-[12px] font-light tabular-nums text-[var(--som-gray)]">
        {formatOrderDateShort(date)}
      </p>
    </li>
  );
}

export function OrderTimelineCard({ order }: { order: OrderDetail }) {
  const updated = order.updated_at !== order.created_at;

  return (
    <AdminCard title="Statut" action={<OrderStatusBadge status={order.status} />}>
      <p className="m-0 mb-4 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">Historique</p>
      <ol className="relative m-0 list-none p-0 before:absolute before:bottom-2 before:left-[3.5px] before:top-2 before:w-px before:bg-[var(--som-border)]">
        {order.delivered_at && <TimelineEvent label="Livrée" date={order.delivered_at} active />}
        {updated && <TimelineEvent label="Dernière mise à jour" date={order.updated_at} active={!order.delivered_at} />}
        <TimelineEvent label="Commande créée" date={order.created_at} active={!updated && !order.delivered_at} />
      </ol>
    </AdminCard>
  );
}
