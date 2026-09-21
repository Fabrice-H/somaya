import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
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
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
          <span className="tabular-nums">{items.length}</span> article{items.length > 1 ? "s" : ""}
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
