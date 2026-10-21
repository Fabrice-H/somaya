import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Td, Tr } from "@/shared/components/admin/ui/Table";
import { formatPrice } from "@/shared/lib/format";
import { ORDERS_PATH, PAYMENT_METHOD_SHORT_LABELS } from "../../../constants";
import { formatOrderDate } from "../../../utils";
import type { OrderSummary } from "../../../types";
import { PAYMENT_METHOD_ICONS } from "../icons";
import { OrderStatusBadge } from "../OrderStatusBadge";

const stop = (event: React.MouseEvent) => event.stopPropagation();

export function OrderRow({ order, onOpen }: { order: OrderSummary; onOpen: (href: string) => void }) {
  const PaymentIcon = PAYMENT_METHOD_ICONS[order.payment_method];
  const href = `${ORDERS_PATH}/${order.id}`;

  return (
    <Tr onClick={() => onOpen(href)}>
      <Td>
        <Link href={href} onClick={stop} className="font-medium tabular-nums hover:text-[var(--som-primary)]">
          {order.order_number}
        </Link>
      </Td>
      <Td>
        <p className="m-0 font-medium">{order.customer_name}</p>
        <p className="m-0 mt-0.5 text-[12px] font-light tabular-nums text-[var(--som-gray)]">{order.customer_phone}</p>
      </Td>
      <Td muted>{formatOrderDate(order.created_at)}</Td>
      <Td muted>
        <span className="inline-flex items-center gap-2 text-[13px]">
          <PaymentIcon size={15} strokeWidth={1.5} aria-hidden />
          {PAYMENT_METHOD_SHORT_LABELS[order.payment_method]}
          {order.payment_status === "paid" && (
            <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--som-success)]">Payée</span>
          )}
          {order.payment_method === "online" && order.payment_status !== "paid" && (
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#8a5a14]">
              {order.payment_status === "failed" ? "Échec" : "Paiement en attente"}
            </span>
          )}
        </span>
      </Td>
      <Td>
        <OrderStatusBadge status={order.status} />
      </Td>
      <Td align="right">
        <span className="font-medium tabular-nums">{formatPrice(order.total)}</span>
      </Td>
      <Td align="right">
        <Link
          href={href}
          onClick={stop}
          aria-label={`Voir la commande ${order.order_number}`}
          className="inline-flex h-10 w-10 items-center justify-center text-[var(--som-gray)] transition-colors hover:text-[var(--som-primary)]"
        >
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </Td>
    </Tr>
  );
}

export function OrderMobileRow({ order }: { order: OrderSummary }) {
  return (
    <Link
      href={`${ORDERS_PATH}/${order.id}`}
      className="block border-b border-[var(--som-border)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--som-surface-alt)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-medium tabular-nums text-[var(--som-ink)]">{order.order_number}</span>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="m-0 mt-2 text-[14px] text-[var(--som-ink)]">{order.customer_name}</p>
      <div className="mt-1 flex items-center justify-between gap-3 text-[12px] font-light text-[var(--som-gray)]">
        <span>{formatOrderDate(order.created_at)}</span>
        <span className="text-[14px] font-medium tabular-nums text-[var(--som-ink)]">{formatPrice(order.total)}</span>
      </div>
    </Link>
  );
}
