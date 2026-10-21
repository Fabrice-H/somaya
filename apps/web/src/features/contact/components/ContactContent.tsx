import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { StoreContact } from "@/features/settings/types";
import { telHref, whatsappHref } from "@/shared/lib/phone";

function lines(value: string) {
  return value.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
}

const rowLabel = "m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]";
const rowValue = "m-0 text-[15px] leading-relaxed text-[var(--som-ink)]";

export function ContactContent({ contact }: { contact: StoreContact }) {
  const { phone, whatsapp, address, hours } = contact;
  const socials = [
    { label: "Instagram", href: `https://www.instagram.com/${contact.instagram}/` },
    { label: "TikTok", href: `https://www.tiktok.com/@${contact.tiktok}` },
    {
      label: "Facebook",
      href: contact.facebook.startsWith("http") ? contact.facebook : `https://www.facebook.com/${contact.facebook}`,
    },
  ];

  return (
    <div className="bg-white">
      <header className="px-4 pb-10 pt-10 text-center md:px-8 md:pb-14 md:pt-14">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
          <Link href="/" className="transition-colors hover:text-[var(--som-primary)]">
            Accueil
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-[var(--som-ink)]">Contact</span>
        </nav>
        <h1
          className="m-0 text-[30px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[44px]"
          style={{ lineHeight: 1.1 }}
        >
          Parlons ensemble
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[15px] font-light leading-relaxed text-[#4a4a4a]">
          Une question, une commande ou simplement envie de nous dire bonjour ? On est là pour vous.
        </p>
      </header>

      <section className="mx-auto max-w-[1240px] px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-12 border-t border-[var(--som-border)] pt-10 md:pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <div className="bg-[var(--som-primary-50)] px-6 py-8 md:px-8">
              <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-primary)]">Le plus rapide</p>
              <p className="m-0 mt-2 text-[20px] font-medium text-[var(--som-ink)]">Écrivez-nous sur WhatsApp</p>
              <p className="m-0 mt-1 text-[14px] font-light text-[#4a4a4a]">
                Commandes, disponibilités, conseils : on vous répond rapidement.
              </p>
              <a
                href={whatsappHref(whatsapp, "Bonjour SO'MAYA !")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6"
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                {whatsapp}
              </a>
            </div>

            <dl className="m-0 mt-4">
              <div className="grid gap-2 border-b border-[var(--som-border)] py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className={rowLabel}>Téléphone</dt>
                <dd className={rowValue}>
                  <a
                    href={telHref(phone)}
                    className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-[var(--som-primary)] sm:min-h-0"
                  >
                    {phone}
                    <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden className="text-[var(--som-gray)]" />
                  </a>
                </dd>
              </div>

              <div className="grid gap-2 border-b border-[var(--som-border)] py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className={rowLabel}>Boutique</dt>
                <dd className={`${rowValue} font-light`}>{lines(address)}</dd>
              </div>

              <div className="grid gap-2 border-b border-[var(--som-border)] py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className={rowLabel}>Horaires</dt>
                <dd className={`${rowValue} font-light`}>{lines(hours)}</dd>
              </div>

              {socials.length > 0 && (
                <div className="grid gap-2 py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className={rowLabel}>Réseaux</dt>
                  <dd className="m-0 flex flex-wrap gap-x-6 gap-y-1">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 text-[12px] uppercase tracking-[0.16em] text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)] sm:min-h-0"
                      >
                        {social.label}
                        <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden className="text-[var(--som-gray)]" />
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="relative min-h-[380px] overflow-hidden bg-[var(--som-primary-50)] lg:min-h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.9631550495205!2d-3.9620294!3d5.4225692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1930016d4bcdf%3A0x566d63be49c7de8d!2sSO'MAYA!5e0!3m2!1sfr!2sci!4v1785570866631!5m2!1sfr!2sci"
              className="absolute inset-0 h-full w-full border-0 grayscale transition-[filter] duration-700 hover:grayscale-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localisation de la boutique SO'MAYA à Angré Château"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
