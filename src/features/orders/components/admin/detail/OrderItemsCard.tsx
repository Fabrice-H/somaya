import { Package } from "lucide-react";
import type { OrderDetail } from "../../../types";
import { OrderItemRow } from "./OrderItemRow";
import { OrderPanel } from "./OrderPanel";
import { OrderTotals } from "./OrderTotals";

export function OrderItemsCard({ order }: { order: OrderDetail }) {
  const { items } = order;

  return (
    <OrderPanel icon={Package} title={`Articles commandés (${items.length})`}>
      <div>
        {items.map((item, index) => (
          <OrderItemRow key={item.id} item={item} isLast={index === items.length - 1} />
        ))}
      </div>
      <OrderTotals subtotal={order.subtotal} delivery_fee={order.delivery_fee} total={order.total} />
    </OrderPanel>
  );
}
