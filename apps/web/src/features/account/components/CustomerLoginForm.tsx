"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import { ACCOUNT_REGISTER_PATH } from "../constants";
import { customerLoginAction } from "../server/actions";
import type { AccountFormState } from "../types";
import { AuthCard, FormMessage } from "./AuthCard";
import { PasswordInput } from "./PasswordInput";

export function CustomerLoginForm({ next = "" }: { next?: string }) {
  const [state, formAction, isPending] = useActionState<AccountFormState, FormData>(customerLoginAction, {});
  const errors = state.fieldErrors ?? {};

  return (
    <AuthCard
      eyebrow="Espace client"
      title="Connexion"
      text="Retrouvez vos commandes, votre suivi et vos points fidélité."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href={next ? `${ACCOUNT_REGISTER_PATH}?next=${encodeURIComponent(next)}` : ACCOUNT_REGISTER_PATH}
            className="underline underline-offset-4 hover:text-[var(--som-primary)]"
          >
            Créer mon compte
          </Link>
        </>
      }
    >
      <form action={formAction} noValidate className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <FormMessage error={state.error} />
        <CheckoutField id="phone" label="Téléphone" required error={errors.phone}>
          {(props) => (
            <div className="input-group-som">
              <span>+225</span>
              <input
                {...props}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="07 00 00 00 00"
                defaultValue={state.values?.phone}
                className="input-som"
              />
            </div>
          )}
        </CheckoutField>
        <CheckoutField id="password" label="Mot de passe" required error={errors.password}>
          {(props) => <PasswordInput {...props} name="password" autoComplete="current-password" />}
        </CheckoutField>
        <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-60">
          {isPending ? "Connexion…" : "Me connecter"}
        </button>
        <p className="m-0 text-center text-[12px] font-light text-[var(--som-gray)]">
          Mot de passe oublié ? Écrivez-nous sur WhatsApp, nous le réinitialisons avec vous.
        </p>
      </form>
    </AuthCard>
  );
}
