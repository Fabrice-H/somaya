import Link from "next/link";
import { Check, Clock, MessageCircle, XCircle } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { whatsappHref } from "@/shared/lib/phone";
import { ACCOUNT_PATH, ACCOUNT_REGISTER_PATH } from "@/features/account/constants";
import { TRACKING_PATH } from "@/features/tracking/constants";
import type { PaymentReturnView } from "../types";
import { PaymentPendingRefresh } from "./PaymentPendingRefresh";
import { PaymentRetryForm } from "./PaymentRetryForm";

const shell = "mx-auto flex max-w-[560px] flex-col items-center px-4 py-20 text-center md:py-28";

export function PaymentReturnContent({ view, whatsapp }: { view: PaymentReturnView; whatsapp: string }) {
  if (view.kind === "unknown") {
    return (
      <section className={shell}>
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Paiement</p>
        <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
          Commande introuvable
        </h1>
        <Link href="/catalogue" className="btn-primary mt-10">
          Retour à la boutique
        </Link>
      </section>
    );
  }

  if (view.kind === "paid") {
    return (
      <section className={shell}>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-primary)] text-white">
          <Check size={28} strokeWidth={1.6} aria-hidden />
        </span>
        <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Paiement confirmé</p>
        <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[32px]">
          Merci {view.firstName}
        </h1>
        <p className="m-0 mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">
          Votre commande <span className="font-normal text-[var(--som-ink)]">{view.orderNumber}</span> de{" "}
          <span className="font-normal tabular-nums text-[var(--som-ink)]">{formatPrice(view.total)}</span> est payée.
          Notre équipe la prépare et vous tient informée.
        </p>
        <a
          href={whatsappHref(whatsapp, `Bonjour, j'ai payé ma commande ${view.orderNumber} en ligne.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-10"
        >
          <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
          Nous écrire sur WhatsApp
        </a>
        <Link
          href={view.hasAccount ? ACCOUNT_PATH : `${TRACKING_PATH}?commande=${view.orderNumber}`}
          className="btn-link mt-4"
        >
          {view.hasAccount ? "Voir mon compte" : "Suivre ma commande"}
        </Link>
        {!view.hasAccount && (
          <p className="m-0 mt-8 text-[13px] font-light text-[#4a4a4a]">
            <Link
              href={`${ACCOUNT_REGISTER_PATH}?order=${view.orderNumber}`}
              className="underline underline-offset-4 hover:text-[var(--som-primary)]"
            >
              Créer mon compte
            </Link>{" "}
            pour retrouver vos commandes et vos points fidélité.
          </p>
        )}
      </section>
    );
  }

  if (view.kind === "pending") {
    return (
      <section className={shell}>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[var(--som-primary)]">
          <Clock size={26} strokeWidth={1.4} aria-hidden />
        </span>
        <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">
          Vérification en cours
        </p>
        <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
          Un instant
        </h1>
        <p className="m-0 mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">
          Nous confirmons le paiement de votre commande{" "}
          <span className="font-normal text-[var(--som-ink)]">{view.orderNumber}</span> auprès de votre opérateur. Cette
          page se met à jour automatiquement.
        </p>
        <PaymentPendingRefresh />
        <Link href={`${TRACKING_PATH}?commande=${view.orderNumber}`} className="btn-link mt-8">
          Suivre ma commande
        </Link>
      </section>
    );
  }

  return (
    <section className={shell}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-error-tint)] text-[var(--som-error)]">
        <XCircle size={28} strokeWidth={1.4} aria-hidden />
      </span>
      <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Paiement non abouti</p>
      <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)]">
        Le paiement n&apos;a pas été confirmé
      </h1>
      <p className="m-0 mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">
        Votre commande <span className="font-normal text-[var(--som-ink)]">{view.orderNumber}</span> est bien
        enregistrée, mais le paiement de {formatPrice(view.total)} n&apos;a pas abouti. Vous pouvez réessayer, ou régler
        à la livraison.
      </p>
      <PaymentRetryForm orderNumber={view.orderNumber} />
      <a
        href={whatsappHref(whatsapp, `Bonjour, je souhaite finaliser ma commande ${view.orderNumber}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-link mt-6"
      >
        <MessageCircle size={15} strokeWidth={1.5} aria-hidden />
        Régler à la livraison via WhatsApp
      </a>
    </section>
  );
}
