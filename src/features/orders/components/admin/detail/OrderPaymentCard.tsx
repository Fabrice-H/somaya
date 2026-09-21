import { CreditCard } from "lucide-react";
import { PAYMENT_METHOD_LABELS } from "../../../constants";
import type { PaymentMethod } from "../../../types";
import { PAYMENT_METHOD_ICONS } from "../icons";
import { OrderPanel } from "./OrderPanel";

export function OrderPaymentCard({ method }: { method: PaymentMethod }) {
  const PaymentIcon = PAYMENT_METHOD_ICONS[method];

  return (
    <OrderPanel icon={CreditCard} title="Paiement">
      <div style={{ padding: "20px 24px" }}>
        <div
          className="inline-flex items-center gap-2"
          style={{ padding: "10px 16px", background: "#fafafa", fontSize: 14, fontWeight: 500, color: "#000000" }}
        >
          <PaymentIcon size={16} style={{ color: "#6b6b6b" }} />
          {PAYMENT_METHOD_LABELS[method]}
        </div>
      </div>
    </OrderPanel>
  );
}
