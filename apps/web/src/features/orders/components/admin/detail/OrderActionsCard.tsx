import type { OrderDetail } from "../../../types";
import { NotifyCustomerButton } from "../NotifyCustomerButton";
import { OrderStatusUpdate } from "../OrderStatusUpdate";
import { OrderPanel } from "./OrderPanel";

const LABEL_STYLE = { fontSize: 13, fontWeight: 500, color: "#000000", marginBottom: 12 } as const;

export function OrderActionsCard({ order }: { order: OrderDetail }) {
  return (
    <OrderPanel title="Actions">
      <div className="grid sm:grid-cols-2 gap-6" style={{ padding: 24 }}>
        <div>
          <p style={LABEL_STYLE}>Mettre à jour le statut</p>
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
        </div>
        <div>
          <p style={LABEL_STYLE}>Prévenir le client</p>
          <NotifyCustomerButton
            order={{
              status: order.status,
              order_number: order.order_number,
              customer_first_name: order.customer_first_name,
              customer_phone: order.customer_phone,
              total: order.total,
            }}
          />
        </div>
      </div>
    </OrderPanel>
  );
}
