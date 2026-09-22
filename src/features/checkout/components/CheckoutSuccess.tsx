import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { whatsappHref } from "@/shared/lib/phone";
import { ACCOUNT_PATH, ACCOUNT_REGISTER_PATH } from "@/features/account/constants";
import { TRACKING_PATH } from "@/features/tracking/constants";
import type { PlacedOrder } from "../types";
import { buildOrderWhatsAppMessage } from "../utils";

type CheckoutSuccessProps = {
  order: PlacedOrder;
  whatsapp: string;
  hasAccount: boolean;
};

export function CheckoutSuccess({ order, whatsapp, hasAccount }: CheckoutSuccessProps) {
  const registerHref = `${ACCOUNT_REGISTER_PATH}?order=${order.orderNumber}&firstName=${encodeURIComponent(order.customer.firstName)}&lastName=${encodeURIComponent(order.customer.lastName)}&phone=${encodeURIComponent(order.customer.phone)}&email=${encodeURIComponent(order.customer.email ?? "")}`;
  return (
    <section className="mx-auto flex max-w-[560px] flex-col items-center px-4 py-20 text-center md:py-28">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-primary)] text-white">
        <Check size={28} strokeWidth={1.6} aria-hidden />
      </span>
      <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Commande enregistrée</p>
      <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[32px]">
        Merci {order.customer.firstName}
      </h1>
      {order.paymentError && (
        <p role="alert" className="m-0 mt-6 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)]">
          {order.paymentError}
        </p>
      )}
      <p className="m-0 mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">
        Votre commande <span className="font-normal text-[var(--som-ink)]"> {order.orderNumber} </span> d&apos;un
        montant de <span className="font-normal text-[var(--som-ink)] tabular-nums">{formatPrice(order.total)}</span>{" "}
        est bien enregistrée. Envoyez-nous le récapitulatif sur WhatsApp pour confirmer la livraison.
      </p>
      <a
        href={whatsappHref(whatsapp, buildOrderWhatsAppMessage(order))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-10"
      >
        <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
        Envoyer sur WhatsApp
      </a>
      <Link href={`${TRACKING_PATH}?commande=${order.orderNumber}`} className="btn-link mt-4">
        Suivre ma commande
      </Link>

      <div className="mt-12 w-full border border-[var(--som-border)] p-6 text-left">
        {hasAccount ? (
          <>
            <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Votre espace client</p>
            <p className="m-0 mt-2 text-[14px] font-light leading-relaxed text-[#4a4a4a]">
              Cette commande est enregistrée dans votre compte. Vous y suivrez son avancement et vos points fidélité.
            </p>
            <Link href={ACCOUNT_PATH} className="btn-secondary mt-5">
              Voir mon compte
            </Link>
          </>
        ) : (
          <>
            <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Créer mon compte</p>
            <p className="m-0 mt-2 text-[14px] font-light leading-relaxed text-[#4a4a4a]">
              En quelques secondes : vos informations sont déjà prêtes, il ne manque qu&apos;un mot de passe. Vous
              suivrez vos commandes et cumulerez vos points fidélité.
            </p>
            <Link href={registerHref} className="btn-secondary mt-5">
              Créer mon compte
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
