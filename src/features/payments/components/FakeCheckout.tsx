"use client";

import { useTransition } from "react";
import { formatPrice } from "@/shared/lib/format";
import { completeFakePaymentAction } from "../server/actions";

type FakeCheckoutProps = { providerReference: string; amount: number; successUrl: string; errorUrl: string };

export function FakeCheckout({ providerReference, amount, successUrl, errorUrl }: FakeCheckoutProps) {
  const [isPending, startTransition] = useTransition();

  const finish = (outcome: "paid" | "failed") =>
    startTransition(async () => {
      await completeFakePaymentAction({ providerReference, outcome });
      window.location.assign(outcome === "paid" ? successUrl : errorUrl);
    });

  return (
    <section className="mx-auto flex max-w-[480px] flex-col items-center px-4 py-24 text-center">
      <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Fournisseur de test</p>
      <h1 className="m-0 mt-3 text-[24px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
        Simulation de paiement
      </h1>
      <p className="m-0 mt-4 text-[15px] font-light text-[#4a4a4a]">
        Montant : <span className="font-medium tabular-nums text-[var(--som-ink)]">{formatPrice(amount)}</span>. Aucun
        argent réel n&apos;est débité.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => finish("paid")}
          disabled={isPending}
          className="btn-primary disabled:opacity-60"
        >
          Simuler un paiement réussi
        </button>
        <button
          type="button"
          onClick={() => finish("failed")}
          disabled={isPending}
          className="btn-secondary disabled:opacity-60"
        >
          Simuler un échec
        </button>
      </div>
    </section>
  );
}
