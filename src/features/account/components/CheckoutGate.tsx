"use client";

import { useState } from "react";
import Link from "next/link";
import { ACCOUNT_LOGIN_PATH, ACCOUNT_REGISTER_PATH } from "../constants";
import { useCartStore } from "@/features/cart/store";
import { GuestDialog } from "./GuestDialog";

type CheckoutGateProps = { compact?: boolean; onDismiss?: () => void; next?: string };

export function CheckoutGate({ compact = false, onDismiss, next = "/commande" }: CheckoutGateProps) {
  const [guestOpen, setGuestOpen] = useState(false);
  const closeCart = useCartStore((state) => state.closeCart);
  const query = `?next=${encodeURIComponent(next)}`;

  return (
    <>
      <div
        className={`border border-[var(--som-primary-200)] bg-[var(--som-primary-50)] ${compact ? "p-5" : "p-6 md:p-8"}`}
      >
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Finalisez votre commande</p>
        <p className="m-0 mt-2 text-[14px] font-light leading-relaxed text-[#4a4a4a]">
          Connectez-vous pour retrouver vos commandes et vos points fidélité, ou continuez sans créer de compte.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href={`${ACCOUNT_LOGIN_PATH}${query}`} onClick={closeCart} className="btn-primary w-full">
            Se connecter
          </Link>
          <button type="button" onClick={() => setGuestOpen(true)} className="btn-secondary w-full">
            Continuer sans compte
          </button>
        </div>
        <p className="m-0 mt-4 text-center text-[12px] font-light text-[var(--som-gray)]">
          Pas encore de compte ?{" "}
          <Link
            href={`${ACCOUNT_REGISTER_PATH}${query}`}
            onClick={closeCart}
            className="underline underline-offset-4 hover:text-[var(--som-primary)]"
          >
            Créer mon compte
          </Link>
          {onDismiss && (
            <>
              {" · "}
              <button
                type="button"
                onClick={onDismiss}
                className="cursor-pointer underline underline-offset-4 hover:text-[var(--som-primary)]"
              >
                Fermer
              </button>
            </>
          )}
        </p>
      </div>
      <GuestDialog open={guestOpen} onClose={() => setGuestOpen(false)} next={next} onBeforeNavigate={closeCart} />
    </>
  );
}
