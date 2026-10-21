"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { backfillDeliveredOrders } from "../../server/actions";

export function LoyaltyBackfillCard({ pending }: { pending: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const run = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await backfillDeliveredOrders();
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setMessage({ tone: "ok", text: result.message ?? "Terminé" });
      router.refresh();
    });
  };

  return (
    <AdminCard title="Rattrapage" description="Commandes livrées avant la mise en place du programme.">
      <p className="m-0 text-[14px] font-light text-[#4a4a4a]">
        <span className="font-medium tabular-nums text-[var(--som-ink)]">{pending}</span> commande
        {pending > 1 ? "s" : ""} livrée{pending > 1 ? "s" : ""} sans points. Le crédit se fait une seule fois par
        commande.
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          role="status"
          className={`m-0 text-[12px] ${message?.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-gray)]"}`}
        >
          {message?.text ?? ""}
        </p>
        <button type="button" onClick={run} disabled={isPending} className="btn-primary btn-sm disabled:opacity-50">
          {isPending ? "Crédit en cours…" : "Créditer les points"}
        </button>
      </div>
    </AdminCard>
  );
}
