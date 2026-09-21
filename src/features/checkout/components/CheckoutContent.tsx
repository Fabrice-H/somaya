"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { useCheckout } from "../hooks/useCheckout";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSuccess } from "./CheckoutSuccess";
import { OrderSummary } from "./OrderSummary";

type CheckoutContentProps = {
  deliveryFee: number;
  whatsapp: string;
};

function CheckoutHeader() {
  return (
    <header className="border-b border-[var(--som-border)] bg-white">
      <div className="mx-auto grid h-16 max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[72px] md:px-8">
        <Link
          href="/catalogue"
          className="inline-flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
        >
          <ArrowLeft size={15} strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">Boutique</span>
        </Link>
        <Link href="/" aria-label="SO'MAYA, accueil">
          <Image src="/images/logo_header.png" alt="SO'MAYA" width={1072} height={291} priority className="h-8 w-auto md:h-9" />
        </Link>
        <span className="justify-self-end text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Commande</span>
      </div>
    </header>
  );
}

export function CheckoutContent({ deliveryFee, whatsapp }: CheckoutContentProps) {
  const hasMounted = useHasMounted();
  const checkout = useCheckout();

  if (!hasMounted) return <CheckoutHeader />;

  if (checkout.placed) {
    return (
      <>
        <CheckoutHeader />
        <CheckoutSuccess order={checkout.placed} whatsapp={whatsapp} />
      </>
    );
  }

  if (checkout.items.length === 0) {
    return (
      <>
        <CheckoutHeader />
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
      </>
    );
  }

  return (
    <>
      <CheckoutHeader />
      <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
        <h1
          className="m-0 mb-10 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:mb-12 md:text-[34px]"
          style={{ lineHeight: 1.15 }}
        >
          Finaliser la commande
        </h1>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          <CheckoutForm
            customer={checkout.customer}
            fieldErrors={checkout.fieldErrors}
            onChange={checkout.updateField}
            onSubmit={checkout.submit}
          />
          <OrderSummary items={checkout.items} deliveryFee={deliveryFee} isPending={checkout.isPending} error={checkout.error} />
        </div>
      </div>
    </>
  );
}
