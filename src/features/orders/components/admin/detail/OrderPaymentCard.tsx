import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { PAYMENT_METHOD_LABELS } from "../../../constants";
import type { PaymentMethod } from "../../../types";
import { PAYMENT_METHOD_ICONS } from "../icons";
import { InfoLine } from "./InfoLine";

export function OrderPaymentCard({ method }: { method: PaymentMethod }) {
  return (
    <AdminCard title="Paiement">
      <InfoLine icon={PAYMENT_METHOD_ICONS[method]} label="Mode de paiement">
        <p className="m-0">{PAYMENT_METHOD_LABELS[method]}</p>
      </InfoLine>
    </AdminCard>
  );
}
