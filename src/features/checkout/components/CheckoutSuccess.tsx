import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { whatsappHref } from "@/shared/lib/phone";
import type { PlacedOrder } from "../types";
import { buildOrderWhatsAppMessage } from "../utils";

type CheckoutSuccessProps = {
  order: PlacedOrder;
  whatsapp: string;
};

export function CheckoutSuccess({ order, whatsapp }: CheckoutSuccessProps) {
  return (
    <section className="mx-auto flex max-w-[560px] flex-col items-center px-4 py-20 text-center md:py-28">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-primary)] text-white">
        <Check size={28} strokeWidth={1.6} aria-hidden />
      </span>
      <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Commande enregistrée</p>
      <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[32px]">
        Merci {order.customer.firstName}
      </h1>
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
      <Link href="/catalogue" className="btn-link mt-4">
        Retour à la boutique
      </Link>
    </section>
  );
}
