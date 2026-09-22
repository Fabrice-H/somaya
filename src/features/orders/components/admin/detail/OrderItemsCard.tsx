import { PackageCheck } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { formatDate } from "@/shared/lib/format";
import type { OrderDetail } from "../../../types";
import { OrderItemRow } from "./OrderItemRow";
import { OrderTotals } from "./OrderTotals";

export function OrderItemsCard({ order }: { order: OrderDetail }) {
  const { items } = order;

  return (
    <AdminCard
      title="Articles"
      padded={false}
      action={
        <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
          {order.stock_applied_at && (
            <span className="inline-flex items-center gap-1 text-[var(--som-success)]">
              <PackageCheck size={13} strokeWidth={1.5} aria-hidden />
              Stock déduit le {formatDate(order.stock_applied_at)}
            </span>
          )}
          <span>
            <span className="tabular-nums">{items.length}</span> article{items.length > 1 ? "s" : ""}
          </span>
        </span>
      }
    >
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </ul>
      <OrderTotals subtotal={order.subtotal} delivery_fee={order.delivery_fee} total={order.total} />
    </AdminCard>
  );
}
