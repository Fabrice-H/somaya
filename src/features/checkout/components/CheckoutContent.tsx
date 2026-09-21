"use client";

import Image from "next/image";
import Link from "next/link";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { lineTotal } from "@/features/cart/utils";
import { useCheckout } from "../hooks/useCheckout";
import { CheckoutStepper } from "./CheckoutStepper";
import { CheckoutSuccess } from "./CheckoutSuccess";
import { OrderSummary } from "./OrderSummary";
import { DetailsStep } from "./steps/DetailsStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ShippingStep } from "./steps/ShippingStep";

type CheckoutContentProps = {
  deliveryFee: number;
  whatsapp: string;
  storeAddress: string;
  storeHours: string;
};

function EmptyCheckout() {
  return (
    <section className="mx-auto flex max-w-[480px] flex-col items-center px-4 py-24 text-center">
      <Image src="/images/logo_mark.png" alt="" width={330} height={291} className="h-10 w-auto opacity-80" />
      <h1 className="m-0 mt-6 text-[24px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
        Votre panier est vide
      </h1>
      <p className="m-0 mt-3 text-[15px] font-light text-[#4a4a4a]">
        Découvrez nos collections et trouvez la pièce qui vous ressemble.
      </p>
      <Link href="/catalogue" className="btn-primary mt-10">
        Découvrir la boutique
      </Link>
    </section>
  );
}

export function CheckoutContent({ deliveryFee, whatsapp, storeAddress, storeHours }: CheckoutContentProps) {
  const hasMounted = useHasMounted();
  const checkout = useCheckout();

  if (!hasMounted) return <div className="min-h-[60vh]" />;
  if (checkout.placed) return <CheckoutSuccess order={checkout.placed} whatsapp={whatsapp} />;
  if (checkout.items.length === 0) return <EmptyCheckout />;

  const appliedFee = checkout.deliveryMethod === "pickup" ? 0 : deliveryFee;
  const total = checkout.items.reduce((sum, item) => sum + lineTotal(item), 0) + appliedFee;

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
      <h1 className="sr-only">Finaliser la commande</h1>
      <CheckoutStepper current={checkout.step} onSelect={checkout.goTo} />

      <div className="mt-12 grid items-start gap-12 md:mt-16 lg:grid-cols-[1fr_380px] lg:gap-20">
        <div>
          {checkout.step === 0 && (
            <DetailsStep
              customer={checkout.customer}
              fieldErrors={checkout.fieldErrors}
              onChange={checkout.updateField}
              onNext={checkout.continueFromDetails}
            />
          )}
          {checkout.step === 1 && (
            <ShippingStep
              customer={checkout.customer}
              fieldErrors={checkout.fieldErrors}
              onChange={checkout.updateField}
              deliveryMethod={checkout.deliveryMethod}
              onDeliveryMethodChange={checkout.setDeliveryMethod}
              deliveryFee={deliveryFee}
              storeAddress={storeAddress}
              storeHours={storeHours}
              onBack={() => checkout.goTo(0)}
              onNext={checkout.continueFromShipping}
            />
          )}
          {checkout.step === 2 && (
            <PaymentStep
              customer={checkout.customer}
              deliveryMethod={checkout.deliveryMethod}
              deliveryFee={appliedFee}
              total={total}
              error={checkout.error}
              pending={checkout.isPending}
              onEdit={checkout.goTo}
              onBack={() => checkout.goTo(1)}
              onSubmit={checkout.submit}
            />
          )}
        </div>
        <OrderSummary items={checkout.items} deliveryFee={appliedFee} />
      </div>
    </div>
  );
}
