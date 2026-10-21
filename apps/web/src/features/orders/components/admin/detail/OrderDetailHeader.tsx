import type { OrderDetail } from "../../../types";
import { NotifyCustomerButton } from "../NotifyCustomerButton";
import { OrderStatusUpdate } from "../OrderStatusUpdate";

export function OrderDetailActions({ order }: { order: OrderDetail }) {
  return (
    <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center">
      <NotifyCustomerButton
        order={{
          status: order.status,
          order_number: order.order_number,
          customer_first_name: order.customer_first_name,
          customer_phone: order.customer_phone,
          total: order.total,
        }}
      />
      <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
    </div>
  );
}
