"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import { ACCOUNT_REGISTER_PATH } from "@/features/account/constants";
import { formatDateTime } from "@/shared/lib/format";
import { trackOrder, type TrackOrderResult } from "../server/actions";
import { OrderItemsSummary } from "./OrderItemsSummary";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { PaymentRetryForm } from "@/features/payments/components/PaymentRetryForm";

export function TrackingContent({ initialOrderNumber = "" }: { initialOrderNumber?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => setResult(await trackOrder({ orderNumber, phone })));
  };

  const fieldErrors = result && !result.ok ? (result.fieldErrors ?? {}) : {};

  return (
    <div className="mx-auto max-w-[760px] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
      <header className="text-center">
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Suivi de commande</p>
        <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[32px]">
          Où en est ma commande ?
        </h1>
        <p className="mx-auto mb-0 mt-3 max-w-[480px] text-[14px] font-light leading-relaxed text-[#4a4a4a]">
          Indiquez le numéro reçu lors de votre commande et le téléphone utilisé.
        </p>
      </header>

      <form
        onSubmit={submit}
        noValidate
        className="mt-10 grid gap-5 border border-[var(--som-border)] p-6 sm:grid-cols-2 md:p-8"
      >
        <CheckoutField id="orderNumber" label="Numéro de commande" required error={fieldErrors.orderNumber}>
          {(props) => (
            <input
              {...props}
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="SM-20260922-AB12"
              autoComplete="off"
              className="input-som uppercase"
            />
          )}
        </CheckoutField>
        <CheckoutField id="phone" label="Téléphone" required error={fieldErrors.phone}>
          {(props) => (
            <div className="input-group-som">
              <span>+225</span>
              <input
                {...props}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="07 00 00 00 00"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="input-som"
              />
            </div>
          )}
        </CheckoutField>
        <div className="sm:col-span-2">
          <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
            <Search size={15} strokeWidth={1.5} aria-hidden />
            {isPending ? "Recherche…" : "Suivre ma commande"}
          </button>
        </div>
        {result && !result.ok && !result.fieldErrors && (
          <p
            role="alert"
            className="m-0 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)] sm:col-span-2"
          >
            {result.error}
          </p>
        )}
      </form>

      {result?.ok && (
        <section className="mt-12" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Commande</p>
              <h2 className="m-0 mt-1 text-[22px] font-medium tabular-nums text-[var(--som-ink)]">
                {result.order.order_number}
              </h2>
            </div>
            <p className="m-0 text-[13px] font-light text-[var(--som-gray)]">
              Passée le {formatDateTime(result.order.created_at)}
            </p>
          </div>
          {result.order.payment_method === "online" &&
            result.order.payment_status !== "paid" &&
            result.order.status !== "cancelled" && (
              <div className="mt-8 border border-[#e6c28b] bg-[#fbf1e3] p-5">
                <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[#8a5a14]">Paiement en attente</p>
                <p className="m-0 mt-2 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
                  Cette commande n&apos;est pas encore payée : elle sera préparée dès réception du paiement et annulée
                  après 24 h sans paiement.
                </p>
                <PaymentRetryForm orderNumber={result.order.order_number} />
              </div>
            )}
          <div className="mt-8">
            <OrderStatusTimeline status={result.order.status} />
          </div>
          <div className="mt-8">
            <OrderItemsSummary order={result.order} />
          </div>
          <p className="m-0 mt-8 text-center text-[13px] font-light text-[#4a4a4a]">
            Retrouvez toutes vos commandes et vos points fidélité en créant votre compte.{" "}
            <Link
              href={`${ACCOUNT_REGISTER_PATH}?order=${result.order.order_number}`}
              className="underline underline-offset-4 hover:text-[var(--som-primary)]"
            >
              Créer mon compte
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
