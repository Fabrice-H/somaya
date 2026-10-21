import { Banknote, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import Image from "next/image";
import { ONLINE_OPERATORS } from "@/features/payments/constants";
import type { OnlineOperator } from "@/features/payments/types";
import type { CheckoutFormValues, CheckoutPaymentMethod, DeliveryMethod } from "../../schemas";
import { ChoiceCard } from "../ChoiceCard";
import { StepActions } from "../StepActions";

type PaymentStepProps = {
  customer: CheckoutFormValues;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  error: string | null;
  pending: boolean;
  paymentMethod: CheckoutPaymentMethod;
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void;
  operator: OnlineOperator | null;
  onOperatorChange: (operator: OnlineOperator) => void;
  onlinePaymentEnabled: boolean;
  onEdit: (step: number) => void;
  onBack: () => void;
  onSubmit: () => void;
};

function RecapCard({
  label,
  onEdit,
  aside,
  children,
}: {
  label: string;
  onEdit: () => void;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--som-border)] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">{label}</p>
          <div className="mt-2 text-[14px] leading-relaxed text-[var(--som-ink)]">{children}</div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {aside && <span className="text-[14px] tabular-nums text-[var(--som-ink)]">{aside}</span>}
          <button
            type="button"
            onClick={onEdit}
            className="min-h-11 cursor-pointer text-[11px] uppercase tracking-[0.16em] text-[var(--som-primary)] hover:underline"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentStep({
  customer,
  deliveryMethod,
  deliveryFee,
  total,
  error,
  pending,
  paymentMethod,
  onPaymentMethodChange,
  operator,
  onOperatorChange,
  onlinePaymentEnabled,
  onEdit,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  const isPickup = deliveryMethod === "pickup";
  const isOnline = paymentMethod === "online";

  return (
    <div>
      <h2 className="m-0 text-[22px] font-semibold text-[var(--som-ink)] md:text-[26px]">Paiement</h2>

      <div className="mt-8 flex flex-col gap-3">
        <RecapCard label="Coordonnées" onEdit={() => onEdit(0)}>
          <p className="m-0 font-medium">
            {customer.firstName} {customer.lastName}
          </p>
          <p className="m-0 font-light text-[#4a4a4a]">+225 {customer.phone}</p>
        </RecapCard>
        <RecapCard label="Livraison" onEdit={() => onEdit(1)} aside={isPickup ? "Gratuit" : formatPrice(deliveryFee)}>
          <p className="m-0 font-medium">{isPickup ? "Retrait en boutique" : "Livraison à domicile"}</p>
          {!isPickup && (
            <p className="m-0 font-light text-[#4a4a4a]">
              {[customer.address, `${customer.commune}, Abidjan`].filter(Boolean).join(", ")}
            </p>
          )}
        </RecapCard>
      </div>

      <p className="m-0 mb-4 mt-10 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">Mode de paiement</p>
      <div className="flex flex-col gap-3">
        <ChoiceCard
          name="payment"
          value="cash"
          checked={!isOnline}
          onChange={() => onPaymentMethodChange("cash")}
          icon={<Banknote size={17} strokeWidth={1.4} />}
          title={isPickup ? "Paiement au retrait" : "Paiement à la livraison"}
          description="En espèces ou par mobile money à la réception de votre commande."
        />
        <ChoiceCard
          name="payment"
          value="online"
          checked={isOnline}
          disabled={!onlinePaymentEnabled}
          onChange={() => onPaymentMethodChange("online")}
          icon={<ShieldCheck size={17} strokeWidth={1.4} />}
          title="Payer maintenant"
          aside={
            onlinePaymentEnabled ? undefined : (
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">Bientôt</span>
            )
          }
          description="Paiement mobile money sécurisé, confirmation immédiate."
        >
          <span
            role="radiogroup"
            aria-label="Opérateur mobile money"
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {ONLINE_OPERATORS.map((item) => {
              const selected = isOnline && operator === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!onlinePaymentEnabled}
                  onClick={(event) => {
                    event.preventDefault();
                    onPaymentMethodChange("online");
                    onOperatorChange(item.id);
                  }}
                  className={`flex cursor-pointer flex-col items-center gap-2 border p-3 text-[11px] uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-[var(--som-primary)] bg-[var(--som-primary-50)] text-[var(--som-ink)]"
                      : "border-[var(--som-border)] text-[#4a4a4a] hover:border-[var(--som-border-strong)]"
                  }`}
                >
                  <span className="relative h-8 w-14 overflow-hidden rounded-sm" style={{ backgroundColor: item.bg }}>
                    <Image
                      src={item.logo}
                      alt=""
                      fill
                      sizes="56px"
                      className={item.fit === "cover" ? "object-cover" : "object-contain p-1"}
                    />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </span>
        </ChoiceCard>
      </div>

      <p className="m-0 mt-6 flex gap-3 border border-[var(--som-border)] p-5 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--som-primary)]" />
        <span>
          {isOnline ? (
            <>
              Vous allez être redirigée vers notre partenaire de paiement pour régler{" "}
              <span className="font-medium text-[var(--som-ink)] tabular-nums">{formatPrice(total)}</span> par mobile
              money. Votre commande est confirmée dès réception du paiement.
            </>
          ) : (
            <>
              Après validation, vous pourrez nous envoyer le récapitulatif sur WhatsApp. Vous réglerez{" "}
              <span className="font-medium text-[var(--som-ink)] tabular-nums">{formatPrice(total)}</span>{" "}
              {isPickup ? "au retrait en boutique" : "à la livraison"}.
            </>
          )}
        </span>
      </p>

      {error && (
        <p role="alert" className="m-0 mt-5 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)]">
          {error}
        </p>
      )}

      <StepActions
        onBack={onBack}
        onNext={onSubmit}
        pending={pending}
        nextLabel={`${isOnline ? "Payer" : "Confirmer"} · ${formatPrice(total)}`}
      />
    </div>
  );
}
