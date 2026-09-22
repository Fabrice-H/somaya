import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { formatDateTime } from "@/shared/lib/format";
import { whatsappHref } from "@/shared/lib/phone";
import { PAYMENT_METHOD_LABELS } from "@/features/orders/constants";
import { OrderItemsSummary } from "@/features/tracking/components/OrderItemsSummary";
import { OrderStatusTimeline } from "@/features/tracking/components/OrderStatusTimeline";
import { ACCOUNT_ORDERS_PATH } from "../constants";
import type { AccountOrderDetail } from "../types";

export function AccountOrderDetailView({ order, whatsapp }: { order: AccountOrderDetail; whatsapp: string }) {
  const message = `Bonjour, j'ai une question concernant ma commande ${order.order_number}.`;
  return (
    <div className="space-y-8">
      <Link
        href={ACCOUNT_ORDERS_PATH}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)] hover:text-[var(--som-ink)]"
      >
        <ArrowLeft size={14} strokeWidth={1.5} aria-hidden />
        Mes commandes
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Commande</p>
          <h2 className="m-0 mt-1 text-[22px] font-medium tabular-nums text-[var(--som-ink)]">{order.order_number}</h2>
        </div>
        <p className="m-0 text-[13px] font-light text-[var(--som-gray)]">
          Passée le {formatDateTime(order.created_at)}
        </p>
      </div>
      <OrderStatusTimeline status={order.status} />
      <OrderItemsSummary order={order} />
      <dl className="m-0 grid gap-4 border border-[var(--som-border)] p-5 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Livraison</dt>
          <dd className="m-0 mt-1 font-light text-[#4a4a4a]">
            {[...new Set([order.address, order.commune].filter(Boolean))].join(", ") || "Retrait en boutique"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Paiement</dt>
          <dd className="m-0 mt-1 font-light text-[#4a4a4a]">
            {PAYMENT_METHOD_LABELS[order.payment_method]} ·{" "}
            {order.payment_status === "paid"
              ? "Payé"
              : order.payment_status === "refunded"
                ? "Remboursé"
                : "En attente"}
          </dd>
        </div>
      </dl>
      <a href={whatsappHref(whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
        <MessageCircle size={15} strokeWidth={1.5} aria-hidden />
        Une question sur cette commande
      </a>
    </div>
  );
}
