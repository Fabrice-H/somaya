"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { retryPaymentAction } from "../server/actions";

export function PaymentRetryForm({ orderNumber }: { orderNumber: string }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await retryPaymentAction({ orderNumber, phone });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.assign(result.checkoutUrl);
    });
  };

  return (
    <form onSubmit={submit} noValidate className="mt-10 w-full max-w-[380px] text-left">
      <label htmlFor="retryPhone" className="label-som">
        Confirmez votre téléphone pour réessayer
      </label>
      <div className="input-group-som">
        <span>+225</span>
        <input
          id="retryPhone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="07 00 00 00 00"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="input-som"
        />
      </div>
      {error && (
        <p role="alert" className="error-som m-0">
          {error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="btn-primary mt-4 w-full disabled:opacity-60">
        <RefreshCw size={15} strokeWidth={1.5} aria-hidden />
        {isPending ? "Redirection…" : "Réessayer le paiement"}
      </button>
    </form>
  );
}
