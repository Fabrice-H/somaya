import { Banknote, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { PAYMENT_METHODS } from "@/shared/config/navigation";
import type { CheckoutFormValues, DeliveryMethod } from "../../schemas";
import { ChoiceCard } from "../ChoiceCard";
import { StepActions } from "../StepActions";

type PaymentStepProps = {
  customer: CheckoutFormValues;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  error: string | null;
  pending: boolean;
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
  onEdit,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  const isPickup = deliveryMethod === "pickup";

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
          checked
          onChange={() => undefined}
          icon={<Banknote size={17} strokeWidth={1.4} />}
          title={isPickup ? "Paiement au retrait" : "Paiement à la livraison"}
          description="En espèces ou par mobile money à la réception de votre commande."
        />
        <ChoiceCard
          name="payment"
          value="online"
          checked={false}
          disabled
          onChange={() => undefined}
          icon={<ShieldCheck size={17} strokeWidth={1.4} />}
          title="Payer maintenant"
          aside={<span className="text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">Bientôt</span>}
          description="Paiement en ligne sécurisé."
        >
          <span className="mt-3 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.name}
                className="bg-[var(--som-surface)] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#4a4a4a]"
              >
                {method.name}
              </span>
            ))}
          </span>
        </ChoiceCard>
      </div>

      <p className="m-0 mt-6 flex gap-3 border border-[var(--som-border)] p-5 text-[13px] font-light leading-relaxed text-[#4a4a4a]">
        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--som-primary)]" />
        <span>
          Après validation, vous pourrez nous envoyer le récapitulatif sur WhatsApp. Vous réglerez{" "}
          <span className="font-medium text-[var(--som-ink)] tabular-nums">{formatPrice(total)}</span>{" "}
          {isPickup ? "au retrait en boutique" : "à la livraison"}.
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
        nextLabel={`Confirmer · ${formatPrice(total)}`}
      />
    </div>
  );
}
