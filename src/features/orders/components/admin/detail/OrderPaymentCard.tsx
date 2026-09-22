import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { formatDateTime, formatPrice } from "@/shared/lib/format";
import { ORDER_CHANNEL_LABELS, PAYMENT_METHOD_NAMES, PAYMENT_STATUS_BADGES } from "@/features/payments/constants";
import type { PaymentDto } from "@/features/payments/types";
import { PAYMENT_METHOD_LABELS } from "../../../constants";
import type { OrderDetail } from "../../../types";
import { PAYMENT_METHOD_ICONS } from "../icons";
import { InfoDivider, InfoLine } from "./InfoLine";

function PaymentAttempt({ payment }: { payment: PaymentDto }) {
  const badge = PAYMENT_STATUS_BADGES[payment.status];
  return (
    <li className="flex flex-col gap-1 text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium tabular-nums text-[var(--som-ink)]">{formatPrice(payment.amount)}</span>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>
      <p className="m-0 font-light text-[var(--som-gray)]">
        {payment.provider === "fake" ? "Test" : "Jèko"}
        {payment.payment_method && ` · ${PAYMENT_METHOD_NAMES[payment.payment_method] ?? payment.payment_method}`}
        {" · "}
        {formatDateTime(payment.paid_at ?? payment.updated_at)}
      </p>
      {payment.provider_reference && (
        <p className="m-0 break-all text-[11px] font-light text-[var(--som-gray)]">Réf. {payment.provider_reference}</p>
      )}
      {payment.failure_reason && <p className="m-0 text-[12px] text-[var(--som-error)]">{payment.failure_reason}</p>}
    </li>
  );
}

export function OrderPaymentCard({ order }: { order: OrderDetail }) {
  const status = PAYMENT_STATUS_BADGES[order.payment_status];
  return (
    <AdminCard title="Paiement" action={<Badge tone={status.tone}>{status.label}</Badge>}>
      <div className="space-y-4">
        <InfoLine icon={PAYMENT_METHOD_ICONS[order.payment_method]} label="Mode de paiement">
          <p className="m-0">{PAYMENT_METHOD_LABELS[order.payment_method]}</p>
          <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">
            Commande {ORDER_CHANNEL_LABELS[order.order_channel]}
            {order.paid_at && ` · payée le ${formatDateTime(order.paid_at)}`}
          </p>
        </InfoLine>
        {order.payments.length > 0 && (
          <>
            <InfoDivider />
            <ul className="m-0 list-none space-y-3 p-0">
              {order.payments.map((payment) => (
                <PaymentAttempt key={payment.id} payment={payment} />
              ))}
            </ul>
          </>
        )}
      </div>
    </AdminCard>
  );
}
