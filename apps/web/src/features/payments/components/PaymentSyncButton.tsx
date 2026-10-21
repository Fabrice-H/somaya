"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { PAYMENT_STATUS_BADGES } from "../constants";
import { syncOrderPaymentAction } from "../server/actions";
import type { PaymentStatus } from "../types";

export function PaymentSyncButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const result = await syncOrderPaymentAction(orderId);
      if (!result.ok) {
        setMessage(result.error ?? "Erreur");
        return;
      }
      setMessage(
        `Statut fournisseur : ${PAYMENT_STATUS_BADGES[result.status as PaymentStatus]?.label ?? result.status}`
      );
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p role="status" className="m-0 text-[12px] font-light text-[var(--som-gray)]">
        {message ?? ""}
      </p>
      <button type="button" onClick={run} disabled={isPending} className="btn-link text-[11px] disabled:opacity-60">
        <RefreshCw size={13} strokeWidth={1.5} aria-hidden className={isPending ? "animate-spin" : ""} />
        Vérifier le paiement
      </button>
    </div>
  );
}
