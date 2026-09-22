import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { ORDER_STATUS_LABELS } from "@/features/orders/constants";
import { ACCOUNT_ORDERS_PATH } from "../constants";
import type { AccountOrderSummary } from "../types";

export function AccountOrdersList({ orders, emptyText }: { orders: AccountOrderSummary[]; emptyText: string }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center border border-[var(--som-border)] px-6 py-14 text-center">
        <ShoppingBag size={26} strokeWidth={1.2} aria-hidden className="text-[var(--som-primary)]" />
        <p className="m-0 mt-4 text-[14px] font-light text-[#4a4a4a]">{emptyText}</p>
        <Link href="/catalogue" className="btn-secondary mt-6">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <ul className="m-0 list-none border border-[var(--som-border)] p-0">
      {orders.map((order) => (
        <li key={order.id} className="border-b border-[var(--som-border)] last:border-b-0">
          <Link
            href={`${ACCOUNT_ORDERS_PATH}/${order.id}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--som-surface-alt)]"
          >
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[14px] font-medium tabular-nums text-[var(--som-ink)]">{order.order_number}</p>
              <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">
                {formatDate(order.created_at)} · {order.items_count} article{order.items_count > 1 ? "s" : ""}
              </p>
            </div>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.14em] sm:inline ${
                order.status === "cancelled"
                  ? "text-[var(--som-error)]"
                  : order.status === "delivered"
                    ? "text-[var(--som-success)]"
                    : "text-[var(--som-primary)]"
              }`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <span className="text-[14px] font-medium tabular-nums text-[var(--som-ink)]">
              {formatPrice(order.total)}
            </span>
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden className="text-[var(--som-gray)]" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
