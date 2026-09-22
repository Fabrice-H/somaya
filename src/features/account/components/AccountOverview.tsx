import Link from "next/link";
import { Gift } from "lucide-react";
import { LOYALTY_LEVEL_BADGES } from "@/features/loyalty/constants";
import { formatDate } from "@/shared/lib/format";
import { ACCOUNT_ORDERS_PATH } from "../constants";
import type { AccountOverview as AccountOverviewData } from "../types";
import { AccountOrdersList } from "./AccountOrdersList";
import { ClaimOrderForm } from "./ClaimOrderForm";

const RECENT_LIMIT = 3;

export function AccountOverview({ overview }: { overview: AccountOverviewData }) {
  const { customer, loyalty } = overview;
  const level = LOYALTY_LEVEL_BADGES[customer.loyalty_level];
  const progress = loyalty.nextLevel
    ? Math.min(100, Math.round((customer.loyalty_points / loyalty.nextLevel.minPoints) * 100))
    : 100;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="bg-[var(--som-primary)] p-6 text-white md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-white/70">Mes points fidélité</p>
              <p className="m-0 mt-3 text-[44px] font-light leading-none tabular-nums">{customer.loyalty_points}</p>
            </div>
            <Gift size={26} strokeWidth={1.2} aria-hidden className="text-white/70" />
          </div>
          <p className="m-0 mt-5 text-[13px] text-white/85">
            Niveau <span className="font-medium text-white">{level.label}</span>
            {loyalty.nextLevel &&
              ` · encore ${loyalty.nextLevel.minPoints - customer.loyalty_points} points avant ${loyalty.nextLevel.label}`}
          </p>
          <div className="mt-3 h-1 w-full bg-white/20">
            <div className="h-full bg-white transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <Link
            href="/fidelite"
            className="mt-5 inline-block text-[11px] uppercase tracking-[0.18em] text-white/85 underline underline-offset-4 hover:text-white"
          >
            Comment ça marche
          </Link>
        </div>
        <div className="border border-[var(--som-border)] p-6 md:p-8">
          <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Derniers mouvements</p>
          {loyalty.history.length === 0 ? (
            <p className="m-0 mt-4 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
              Vos points apparaîtront ici dès votre première commande livrée.
            </p>
          ) : (
            <ul className="m-0 mt-4 list-none space-y-3 p-0">
              {loyalty.history.slice(0, 4).map((transaction) => (
                <li key={transaction.id} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate font-light text-[#4a4a4a]">
                    {formatDate(transaction.created_at)}
                    {transaction.order_number && ` · ${transaction.order_number}`}
                  </span>
                  <span
                    className={`shrink-0 font-medium tabular-nums ${transaction.points >= 0 ? "text-[var(--som-success)]" : "text-[var(--som-error)]"}`}
                  >
                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">
            Mes dernières commandes
          </h2>
          {overview.orders.length > RECENT_LIMIT && (
            <Link
              href={ACCOUNT_ORDERS_PATH}
              className="text-[12px] uppercase tracking-[0.16em] text-[var(--som-primary)] hover:underline"
            >
              Tout voir
            </Link>
          )}
        </div>
        <AccountOrdersList
          orders={overview.orders.slice(0, RECENT_LIMIT)}
          emptyText="Aucune commande pour le moment."
        />
      </section>

      <ClaimOrderForm hiddenCount={overview.hiddenOrdersCount} />
    </div>
  );
}
