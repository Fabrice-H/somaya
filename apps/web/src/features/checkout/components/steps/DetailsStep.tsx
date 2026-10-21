import type { CheckoutFormValues } from "../../schemas";
import { CheckoutField } from "../CheckoutField";
import { StepActions } from "../StepActions";

type DetailsStepProps = {
  customer: CheckoutFormValues;
  fieldErrors: Record<string, string[]>;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  onNext: () => void;
};

export function DetailsStep({ customer, fieldErrors, onChange, onNext }: DetailsStepProps) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <h2 className="m-0 text-[22px] font-semibold text-[var(--som-ink)] md:text-[26px]">Vos coordonnées</h2>
      <p className="m-0 mt-1.5 text-[14px] font-light text-[#4a4a4a]">
        Pour vous contacter au sujet de votre commande.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
            id="email"
            label="Email"
            error={fieldErrors.email}
            hint="Facultatif, pour recevoir le suivi de votre commande."
          >
            {(props) => (
              <input
                {...props}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={customer.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="input-som"
              />
            )}
          </CheckoutField>
        </div>
        <div className="sm:col-span-2">
          <CheckoutField
            id="phone"
            label="Téléphone"
            required
            error={fieldErrors.phone}
            hint="Nous vous appelons pour confirmer la livraison."
          >
            {(props) => (
              <div className="input-group-som">
                <span>+225</span>
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

      <button type="submit" hidden />
      <StepActions onNext={onNext} nextLabel="Continuer vers la livraison" />
    </form>
  );
}
