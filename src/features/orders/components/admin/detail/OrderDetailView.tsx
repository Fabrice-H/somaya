import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { ORDERS_PATH } from "../../../constants";
import { formatOrderDateLong } from "../../../utils";
import type { OrderDetail } from "../../../types";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderDeliveryCard } from "./OrderDeliveryCard";
import { OrderDetailActions } from "./OrderDetailHeader";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderPaymentCard } from "./OrderPaymentCard";
import { OrderTimelineCard } from "./OrderTimelineCard";

export function OrderDetailView({ order }: { order: OrderDetail }) {
  return (
    <AdminPage
      eyebrow="Commande"
      title={order.order_number}
      description={`Passée le ${formatOrderDateLong(order.created_at)}`}
      back={{ href: ORDERS_PATH, label: "Retour aux commandes" }}
      actions={<OrderDetailActions order={order} />}
    >
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderItemsCard order={order} />
        </div>
        <div className="space-y-6">
          <OrderTimelineCard order={order} />
          <OrderCustomerCard order={order} />
          <OrderDeliveryCard order={order} />
          <OrderPaymentCard method={order.payment_method} />
        </div>
      </div>
    </AdminPage>
  );
}
