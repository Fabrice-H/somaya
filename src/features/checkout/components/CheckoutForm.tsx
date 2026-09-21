import { Banknote } from "lucide-react";
import { ABIDJAN_COMMUNES } from "../constants";
import type { CheckoutFormValues } from "../schemas";
import { CheckoutField } from "./CheckoutField";

type CheckoutFormProps = {
  customer: CheckoutFormValues;
  fieldErrors: Record<string, string[]>;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  onSubmit: () => void;
};

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="m-0 border-0 border-t border-[var(--som-border)] p-0 pt-8 first:border-t-0 first:pt-0">
      <legend className="mb-6 flex items-baseline gap-3 p-0 text-[15px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
        <span className="text-[12px] font-medium text-[var(--som-primary)]">{number}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function CheckoutForm({ customer, fieldErrors, onChange, onSubmit }: CheckoutFormProps) {
  return (
    <form
      id="checkout-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-10"
    >
      <Step number="01" title="Vos coordonnées">
        <div className="grid gap-5 sm:grid-cols-2">
          <CheckoutField id="firstName" label="Prénom" required error={fieldErrors.firstName}>
            {(props) => (
              <input
                {...props}
                autoComplete="given-name"
                value={customer.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                className="input-som"
              />
            )}
          </CheckoutField>
          <CheckoutField id="lastName" label="Nom" required error={fieldErrors.lastName}>
            {(props) => (
              <input
                {...props}
                autoComplete="family-name"
                value={customer.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                className="input-som"
              />
            )}
          </CheckoutField>
          <div className="sm:col-span-2">
            <CheckoutField
              id="phone"
              label="Téléphone"
              required
              error={fieldErrors.phone}
              hint="Nous vous appelons pour confirmer la livraison."
            >
              {(props) => (
                <div className="flex">
                  <span className="flex min-h-12 items-center border border-r-0 border-[var(--som-border-input)] bg-[var(--som-surface-alt)] px-4 text-[14px] text-[var(--som-gray)]">
                    +225
                  </span>
                  <input
                    {...props}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="07 00 00 00 00"
                    value={customer.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="input-som"
                  />
                </div>
              )}
            </CheckoutField>
          </div>
        </div>
      </Step>

      <Step number="02" title="Livraison">
        <div className="grid gap-5">
          <CheckoutField id="commune" label="Commune" required error={fieldErrors.commune}>
            {(props) => (
              <select
                {...props}
                value={customer.commune}
                onChange={(e) => onChange("commune", e.target.value)}
                className="input-som cursor-pointer"
              >
                <option value="" disabled>
                  Sélectionnez votre commune
                </option>
                {ABIDJAN_COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            )}
          </CheckoutField>
          <CheckoutField id="address" label="Adresse" hint="Quartier, rue, point de repère…" error={fieldErrors.address}>
            {(props) => (
              <input
                {...props}
                autoComplete="street-address"
                value={customer.address}
                onChange={(e) => onChange("address", e.target.value)}
                className="input-som"
              />
            )}
          </CheckoutField>
          <CheckoutField id="notes" label="Instructions de livraison" error={fieldErrors.notes}>
            {(props) => (
              <textarea
                {...props}
                rows={3}
                value={customer.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                className="input-som"
              />
            )}
          </CheckoutField>
        </div>
      </Step>

      <Step number="03" title="Paiement">
        <div className="flex items-start gap-4 border border-[var(--som-ink)] p-5">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--som-ink)]">
            <span className="h-2 w-2 rounded-full bg-[var(--som-primary)]" />
          </span>
          <div className="flex-1">
            <p className="m-0 flex items-center gap-2 text-[14px] font-medium text-[var(--som-ink)]">
              <Banknote size={17} strokeWidth={1.4} aria-hidden />
              Paiement à la livraison
            </p>
            <p className="m-0 mt-1 text-[13px] font-light text-[#4a4a4a]">
              En espèces ou par mobile money (Wave, Orange Money, MTN, Moov) à la réception.
            </p>
          </div>
        </div>
      </Step>
    </form>
  );
}
