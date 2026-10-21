import { ORDER_STATUS_BADGES, type OrderStatus } from "./constants";
import { Badge } from "./ui/Badge";

export type { OrderStatus };

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_BADGES[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
