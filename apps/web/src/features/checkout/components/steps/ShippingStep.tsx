import { MapPin, Store, Truck } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { ABIDJAN_COMMUNES } from "../../constants";
import type { CheckoutFormValues, DeliveryMethod } from "../../schemas";
import { CheckoutField } from "../CheckoutField";
import { ChoiceCard } from "../ChoiceCard";
import { StepActions } from "../StepActions";

type ShippingStepProps = {
  customer: CheckoutFormValues;
  fieldErrors: Record<string, string[]>;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  deliveryFee: number;
  storeAddress: string;
  storeHours: string;
  onBack: () => void;
  onNext: () => void;
};

export function ShippingStep({
  customer,
  fieldErrors,
  onChange,
  deliveryMethod,
  onDeliveryMethodChange,
  deliveryFee,
  storeAddress,
  storeHours,
  onBack,
  onNext,
}: ShippingStepProps) {
  const select = (value: string) => onDeliveryMethodChange(value as DeliveryMethod);

  return (
    <div>
      <h2 className="m-0 text-[22px] font-semibold text-[var(--som-ink)] md:text-[26px]">Mode de livraison</h2>
      <p className="m-0 mt-1.5 text-[14px] font-light text-[#4a4a4a]">Abidjan et environs, Côte d&apos;Ivoire.</p>

      <div className="mt-8 flex flex-col gap-3">
        <ChoiceCard
          name="delivery"
          value="delivery"
          checked={deliveryMethod === "delivery"}
          onChange={select}
          icon={<Truck size={17} strokeWidth={1.4} />}
          title="Livraison à domicile"
          description="Abidjan en 24h, environs en 48 à 72h."
          aside={<span className="text-[var(--som-ink)]">{formatPrice(deliveryFee)}</span>}
        />
        <ChoiceCard
          name="delivery"
          value="pickup"
          checked={deliveryMethod === "pickup"}
          onChange={select}
          icon={<Store size={17} strokeWidth={1.4} />}
          title="Retrait en boutique"
          description={storeAddress.split("\n")[0]}
          aside={<span className="text-[var(--som-success)]">Gratuit</span>}
        >
          <span className="mt-1 block text-[12px] font-light text-[var(--som-gray)]">
            {storeHours.split("\n").join(" · ")}
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("SO'MAYA Angré Château Abidjan")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--som-primary)] hover:underline"
          >
            <MapPin size={13} strokeWidth={1.5} aria-hidden />
            Voir sur Google Maps
          </a>
        </ChoiceCard>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="mt-8 grid gap-5">
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
          <CheckoutField
            id="address"
            label="Adresse"
            hint="Quartier, rue, point de repère…"
            error={fieldErrors.address}
          >
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
      )}

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continuer vers le paiement" />
    </div>
  );
}
