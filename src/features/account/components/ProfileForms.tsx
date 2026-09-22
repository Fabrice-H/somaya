"use client";

import { useActionState } from "react";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import { ABIDJAN_COMMUNES } from "@/features/checkout/constants";
import { formatPhone } from "@/shared/lib/phone";
import { PASSWORD_MIN_LENGTH } from "../constants";
import { changePasswordAction, updateProfileAction } from "../server/actions";
import type { AccountCustomer, AccountFormState } from "../types";
import { FormMessage } from "./AuthCard";
import { PasswordInput } from "./PasswordInput";

export function ProfileForm({ customer }: { customer: AccountCustomer }) {
  const [state, formAction, isPending] = useActionState<AccountFormState, FormData>(updateProfileAction, {});
  const errors = state.fieldErrors ?? {};
  const value = (key: string, fallback: string) => state.values?.[key] ?? fallback;

  return (
    <form action={formAction} noValidate className="space-y-5 border border-[var(--som-border)] p-6 md:p-8">
      <h2 className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Mes informations</h2>
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CheckoutField id="firstName" label="Prénom" required error={errors.firstName}>
          {(props) => (
            <input
              {...props}
              name="firstName"
              defaultValue={value("firstName", customer.first_name)}
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
              defaultValue={value("lastName", customer.last_name)}
              autoComplete="family-name"
              className="input-som"
            />
          )}
        </CheckoutField>
      </div>
      <CheckoutField id="phoneDisplay" label="Téléphone" hint="Votre identifiant ; contactez-nous pour le modifier.">
        {(props) => <input {...props} value={formatPhone(customer.phone)} readOnly className="input-som opacity-70" />}
      </CheckoutField>
      <CheckoutField id="email" label="Email" error={errors.email}>
        {(props) => (
          <input
            {...props}
            name="email"
            type="email"
            defaultValue={value("email", customer.email ?? "")}
            autoComplete="email"
            className="input-som"
          />
        )}
      </CheckoutField>
      <div className="grid gap-5 sm:grid-cols-2">
        <CheckoutField id="commune" label="Commune" error={errors.commune}>
          {(props) => (
            <select
              {...props}
              name="commune"
              defaultValue={value("commune", customer.commune ?? "")}
              className="input-som"
            >
              <option value="">Choisir…</option>
              {ABIDJAN_COMMUNES.map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
          )}
        </CheckoutField>
        <CheckoutField id="address" label="Adresse de livraison" error={errors.address}>
          {(props) => (
            <input
              {...props}
              name="address"
              defaultValue={value("address", customer.address ?? "")}
              autoComplete="street-address"
              className="input-som"
            />
          )}
        </CheckoutField>
      </div>
      <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState<AccountFormState, FormData>(changePasswordAction, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5 border border-[var(--som-border)] p-6 md:p-8">
      <h2 className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Mot de passe</h2>
      <FormMessage error={state.error} success={state.success} />
      <CheckoutField id="currentPassword" label="Mot de passe actuel" required error={errors.currentPassword}>
        {(props) => <PasswordInput {...props} name="currentPassword" autoComplete="current-password" />}
      </CheckoutField>
      <div className="grid gap-5 sm:grid-cols-2">
        <CheckoutField
          id="newPassword"
          label="Nouveau mot de passe"
          required
          error={errors.newPassword}
          hint={`Au moins ${PASSWORD_MIN_LENGTH} caractères.`}
        >
          {(props) => <PasswordInput {...props} name="newPassword" autoComplete="new-password" />}
        </CheckoutField>
        <CheckoutField id="confirmPassword" label="Confirmation" required error={errors.confirmPassword}>
          {(props) => <PasswordInput {...props} name="confirmPassword" autoComplete="new-password" />}
        </CheckoutField>
      </div>
      <button type="submit" disabled={isPending} className="btn-secondary disabled:opacity-60">
        {isPending ? "Modification…" : "Modifier le mot de passe"}
      </button>
    </form>
  );
}
