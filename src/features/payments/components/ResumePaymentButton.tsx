"use client";

import { useState, useTransition } from "react";
import { CreditCard } from "lucide-react";
import { resumeOrderPaymentAction } from "../server/actions";

export function ResumePaymentButton({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      setError(null);
      const result = await resumeOrderPaymentAction(orderId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.assign(result.checkoutUrl);
    });

  return (
    <div className="border border-[#e6c28b] bg-[#fbf1e3] p-5">
      <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[#8a5a14]">Paiement en attente</p>
      <p className="m-0 mt-2 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
        Cette commande n&apos;est pas encore payée. Elle sera préparée dès réception du paiement, et annulée
        automatiquement après 24 h sans paiement.
      </p>
      {error && (
        <p role="alert" className="error-som m-0 mt-2">
          {error}
        </p>
      )}
      <button type="button" onClick={run} disabled={isPending} className="btn-primary mt-4 disabled:opacity-60">
        <CreditCard size={15} strokeWidth={1.5} aria-hidden />
        {isPending ? "Redirection…" : "Reprendre le paiement"}
      </button>
    </div>
  );
}
