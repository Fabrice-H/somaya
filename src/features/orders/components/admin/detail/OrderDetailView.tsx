import type { OrderDetail } from "../../../types";
import { OrderActionsCard } from "./OrderActionsCard";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderPaymentCard } from "./OrderPaymentCard";
import { OrderTimelineCard } from "./OrderTimelineCard";

export function OrderDetailView({ order }: { order: OrderDetail }) {
  return (
    <div>
      <OrderDetailHeader order={order} />
      <div style={{ padding: "32px 40px" }}>
        <div className="grid lg:grid-cols-3 gap-6" style={{ maxWidth: 1200 }}>
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsCard order={order} />
            <OrderActionsCard order={order} />
          </div>
          <div className="space-y-6">
            <OrderCustomerCard order={order} />
            <OrderPaymentCard method={order.payment_method} />
            <OrderTimelineCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
