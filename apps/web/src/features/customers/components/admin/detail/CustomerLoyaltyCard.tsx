"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { formatDate } from "@/shared/lib/format";
import { LoyaltyTransactionBadge, PointsDelta } from "@/features/loyalty/components/admin/LoyaltyTransactionBadge";
import { LOYALTY_LEVEL_BADGES, LOYALTY_REASON_MAX_LENGTH } from "@/features/loyalty/constants";
import { adjustCustomerPoints } from "@/features/loyalty/server/actions";
import { ORDERS_PATH } from "@/features/orders/constants";
import type { CustomerDetail } from "../../../types";

export function CustomerLoyaltyCard({ customer }: { customer: CustomerDetail }) {
  const router = useRouter();
  const level = LOYALTY_LEVEL_BADGES[customer.loyalty_level];
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await adjustCustomerPoints({ customerId: customer.id, points: Number(points), reason });
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setMessage({ tone: "ok", text: result.message ?? "Enregistré" });
      setPoints("");
      setReason("");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <AdminCard
      title="Fidélité"
      action={
        <button type="button" onClick={() => setOpen((value) => !value)} className="btn-link text-[11px]">
          {open ? "Fermer" : "Ajuster"}
        </button>
      }
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Points</p>
          <p className="m-0 mt-2 text-[30px] font-light leading-none tabular-nums text-[var(--som-ink)]">
            {customer.loyalty_points}
          </p>
        </div>
        <Badge tone={level.tone}>{level.label}</Badge>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-3 border-t border-[var(--som-border)] pt-5">
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div>
              <label htmlFor="adjust_points" className="label-som">
                Points
              </label>
              <input
                id="adjust_points"
                type="number"
                inputMode="numeric"
                placeholder="+10 / -5"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                className="input-som"
                required
              />
            </div>
            <div>
              <label htmlFor="adjust_reason" className="label-som">
                Motif
              </label>
              <input
                id="adjust_reason"
                type="text"
                maxLength={LOYALTY_REASON_MAX_LENGTH}
                placeholder="Geste commercial, erreur…"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="input-som"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button type="submit" disabled={isPending} className="btn-primary btn-sm disabled:opacity-50">
              {isPending ? "Enregistrement…" : "Valider"}
            </button>
          </div>
        </form>
      )}

      <p
        role="status"
        className={`m-0 mt-3 min-h-4 text-[12px] ${message?.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-success)]"}`}
      >
        {message?.text ?? ""}
      </p>

      {customer.loyalty_history.length > 0 ? (
        <ul className="m-0 mt-2 list-none space-y-3 border-t border-[var(--som-border)] p-0 pt-4">
          {customer.loyalty_history.map((transaction) => (
            <li key={transaction.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <LoyaltyTransactionBadge type={transaction.type} />
                  {transaction.order_id && transaction.order_number && (
                    <Link
                      href={`${ORDERS_PATH}/${transaction.order_id}`}
                      className="text-[12px] tabular-nums hover:text-[var(--som-primary)]"
                    >
                      {transaction.order_number}
                    </Link>
                  )}
                </div>
                <p className="m-0 mt-1 truncate text-[12px] font-light text-[var(--som-gray)]">
                  {formatDate(transaction.created_at)}
                  {transaction.reason && ` · ${transaction.reason}`}
                </p>
              </div>
              <PointsDelta points={transaction.points} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 mt-2 text-[12px] font-light leading-relaxed text-[var(--som-gray)]">
          Les points sont attribués quand une commande est livrée.
        </p>
      )}
    </AdminCard>
  );
}
