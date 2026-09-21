import { Clock } from "lucide-react";
import { formatOrderDateShort } from "../../../utils";
import type { OrderDetail } from "../../../types";
import { OrderPanel } from "./OrderPanel";

function TimelineEvent({ label, date, color }: { label: string; date: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <div>
        <p style={{ fontSize: 13, color: "#000000" }}>{label}</p>
        <p style={{ fontSize: 11, color: "#6b6b6b" }}>{formatOrderDateShort(date)}</p>
      </div>
    </div>
  );
}

export function OrderTimelineCard({ order }: { order: OrderDetail }) {
  return (
    <OrderPanel icon={Clock} title="Historique">
      <div className="space-y-4" style={{ padding: "20px 24px" }}>
        <TimelineEvent label="Commande créée" date={order.created_at} color="#511f29" />
        {order.updated_at !== order.created_at && (
          <TimelineEvent label="Dernière mise à jour" date={order.updated_at} color="#16a34a" />
        )}
        {order.delivered_at && <TimelineEvent label="Livrée" date={order.delivered_at} color="#065F46" />}
      </div>
    </OrderPanel>
  );
}
