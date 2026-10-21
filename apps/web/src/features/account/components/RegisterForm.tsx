"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import { ACCOUNT_LOGIN_PATH, PASSWORD_MIN_LENGTH } from "../constants";
import { registerAction } from "../server/actions";
import type { AccountFormState } from "../types";
import { AuthCard, FormMessage } from "./AuthCard";
import { PasswordInput } from "./PasswordInput";

type RegisterFormProps = {
  next?: string;
  orderNumber?: string;
  defaults?: Partial<Record<"firstName" | "lastName" | "phone" | "email", string>>;
};

export function RegisterForm({ next = "", orderNumber = "", defaults = {} }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState<AccountFormState, FormData>(registerAction, {});
  const errors = state.fieldErrors ?? {};
  const value = (key: keyof NonNullable<RegisterFormProps["defaults"]>) => state.values?.[key] ?? defaults[key];

  return (
    <AuthCard
      eyebrow="Espace client"
      title="Créer mon compte"
      text="Votre numéro de téléphone devient votre identifiant. Vos points fidélité y sont rattachés."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            href={next ? `${ACCOUNT_LOGIN_PATH}?next=${encodeURIComponent(next)}` : ACCOUNT_LOGIN_PATH}
            className="underline underline-offset-4 hover:text-[var(--som-primary)]"
          >
            Me connecter
          </Link>
        </>
      }
    >
      <form action={formAction} noValidate className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="orderNumber" value={orderNumber} />
        <FormMessage error={state.error} />
        <div className="grid gap-5 sm:grid-cols-2">
          <CheckoutField id="firstName" label="Prénom" required error={errors.firstName}>
            {(props) => (
              <input
                {...props}
                name="firstName"
                defaultValue={value("firstName")}
                autoComplete="given-name"
                className="input-som"
              />
            )}
          </CheckoutField>
          <CheckoutField id="lastName" label="Nom" required error={errors.lastName}>
            {(props) => (
              <input
                {...props}
                name="lastName"
                defaultValue={value("lastName")}
                autoComplete="family-name"
                className="input-som"
              />
            )}
          </CheckoutField>
        </div>
        <CheckoutField
          id="phone"
          label="Téléphone"
          required
          error={errors.phone}
          hint="Le même numéro que pour vos commandes."
        >
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
                defaultValue={value("phone")}
                className="input-som"
              />
            </div>
          )}
        </CheckoutField>
        <CheckoutField id="email" label="Email" error={errors.email} hint="Facultatif.">
          {(props) => (
            <input
              {...props}
              name="email"
              type="email"
              inputMode="email"
              defaultValue={value("email")}
              autoComplete="email"
              className="input-som"
            />
          )}
        </CheckoutField>
        <CheckoutField
          id="password"
          label="Mot de passe"
          required
          error={errors.password}
          hint={`Au moins ${PASSWORD_MIN_LENGTH} caractères.`}
        >
          {(props) => <PasswordInput {...props} name="password" autoComplete="new-password" />}
        </CheckoutField>
        <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-60">
          {isPending ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </AuthCard>
  );
}
