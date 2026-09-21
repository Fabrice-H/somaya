import clsx from "clsx";
import { ORDER_STATUS_BADGES, type OrderStatus } from "./constants";

export type { OrderStatus };

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_BADGES[status];
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
