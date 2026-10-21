"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const INTERVAL_MS = 4000;
const MAX_ATTEMPTS = 15;

export function PaymentPendingRefresh() {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return;
    const timer = setTimeout(() => {
      setAttempts((value) => value + 1);
      router.refresh();
    }, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [attempts, router]);

  return (
    <p
      role="status"
      className="m-0 mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-[var(--som-gray)]"
    >
      {attempts < MAX_ATTEMPTS ? (
        <>
          <Loader2 size={14} strokeWidth={1.5} className="animate-spin text-[var(--som-primary)]" aria-hidden />
          Vérification…
        </>
      ) : (
        "Toujours en attente : votre opérateur peut mettre quelques minutes."
      )}
    </p>
  );
}
