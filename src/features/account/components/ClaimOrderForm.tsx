"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import { claimOrderAction } from "../server/actions";

export function ClaimOrderForm({ hiddenCount }: { hiddenCount: number }) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [total, setTotal] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await claimOrderAction({ orderNumber, total });
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setMessage({ tone: "ok", text: result.message ?? "Commande ajoutée" });
      setOrderNumber("");
      setTotal("");
      router.refresh();
    });
  };

  return (
    <section className="border border-[var(--som-border)] p-6">
      <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">
        Retrouver une ancienne commande
      </p>
      <p className="m-0 mt-2 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
        {hiddenCount > 0
          ? `${hiddenCount} commande${hiddenCount > 1 ? "s" : ""} passée${hiddenCount > 1 ? "s" : ""} avec votre numéro avant la création de votre compte. Indiquez son numéro et son montant total pour l'ajouter ici.`
          : "Une commande passée avant la création de votre compte ? Indiquez son numéro et son montant total."}
      </p>
      <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <CheckoutField id="claimOrderNumber" label="Numéro de commande" required>
          {(props) => (
            <input
              {...props}
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="SM-20260922-AB12"
              className="input-som uppercase"
            />
          )}
        </CheckoutField>
        <CheckoutField id="claimTotal" label="Total (FCFA)" required>
          {(props) => (
            <input
              {...props}
              type="number"
              inputMode="numeric"
              min={0}
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              className="input-som"
            />
          )}
        </CheckoutField>
        <button type="submit" disabled={isPending} className="btn-secondary disabled:opacity-60">
          {isPending ? "Recherche…" : "Ajouter"}
        </button>
      </form>
      {message && (
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={`m-0 mt-4 text-[13px] ${message.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-success)]"}`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
