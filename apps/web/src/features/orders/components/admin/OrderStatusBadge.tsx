import { StatusBadge } from "@/shared/components/admin/StatusBadge";
import type { OrderStatus } from "../../types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge status={status} />;
}
