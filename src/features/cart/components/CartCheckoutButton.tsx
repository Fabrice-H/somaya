"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckoutGate } from "@/features/account/components/CheckoutGate";

export function CartCheckoutButton({ onNavigate }: { onNavigate: () => void }) {
  const { data: session, status } = useSession();
  const [gateOpen, setGateOpen] = useState(false);
  const isCustomer = session?.user?.role === "customer";

  if (isCustomer || status === "loading") {
    return (
      <Link href="/commande" onClick={onNavigate} className="btn-primary mt-5 w-full">
        Commander
      </Link>
    );
  }

  if (gateOpen) {
    return (
      <div className="mt-5">
        <CheckoutGate compact onDismiss={() => setGateOpen(false)} />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setGateOpen(true)} className="btn-primary mt-5 w-full">
      Commander
    </button>
  );
}
