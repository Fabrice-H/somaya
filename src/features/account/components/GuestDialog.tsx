"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Phone, X } from "lucide-react";
import { useModalBehavior } from "@/shared/hooks/useModalBehavior";
import { ACCOUNT_LOGIN_PATH } from "../constants";
import { continueAsGuestAction } from "../server/actions";

type GuestDialogProps = { open: boolean; onClose: () => void; next?: string };

export function GuestDialog({ open, onClose, next = "/commande" }: GuestDialogProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [isPending, startTransition] = useTransition();
  useModalBehavior(open, onClose);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setHasAccount(false);
    startTransition(async () => {
      const result = await continueAsGuestAction({ phone });
      if (!result.ok) {
        setError(result.error);
        setHasAccount(result.reason === "has_account");
        return;
      }
      window.location.assign(next);
    });
  };

  return (
    <div className={`fixed inset-0 z-[130] ${open ? "" : "pointer-events-none"}`} inert={!open} aria-hidden={!open}>
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-dialog-title"
        className={`absolute left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-300 md:p-8 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Commande rapide</p>
            <h2 id="guest-dialog-title" className="m-0 mt-2 text-[22px] font-semibold text-[var(--som-ink)]">
              Continuer sans compte
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-2 -mt-2 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
          >
            <X size={20} strokeWidth={1.4} />
          </button>
        </div>
        <p className="m-0 mt-4 text-[14px] font-light leading-relaxed text-[#4a4a4a]">
          Indiquez votre numéro : un espace temporaire est créé pour suivre cette commande. Vous pourrez le sécuriser
          avec un mot de passe quand vous voudrez.
        </p>
        <form onSubmit={submit} noValidate className="mt-6">
          <label htmlFor="guest-phone" className="label-som">
            Téléphone
          </label>
          <div className="input-group-som">
            <span className="inline-flex items-center gap-1.5">
              <Phone size={14} strokeWidth={1.5} aria-hidden />
              +225
            </span>
            <input
              id="guest-phone"
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
              {error}{" "}
              {hasAccount && (
                <Link
                  href={`${ACCOUNT_LOGIN_PATH}?next=${encodeURIComponent(next)}`}
                  className="underline underline-offset-4"
                >
                  Me connecter
                </Link>
              )}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending || phone.trim().length < 8}
            className="btn-primary mt-5 w-full disabled:opacity-50"
          >
            {isPending ? "Un instant…" : "Continuer"}
          </button>
        </form>
      </div>
    </div>
  );
}
