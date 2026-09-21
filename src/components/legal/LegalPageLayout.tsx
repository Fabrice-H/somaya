import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getFooterData } from "@/lib/queries/footer";
import { LegalToc } from "./LegalToc";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LEGAL_PAGES = [
  { label: "Livraison & Retours", href: "/livraison-retours" },
  { label: "Conditions Générales de Vente", href: "/conditions-generales" },
  { label: "Politique de Confidentialité", href: "/politique-confidentialite" },
];

export async function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const { contact } = await getFooterData();
  const whatsapp = contact.whatsapp || "+225 05 08 90 56 66";
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;
  const otherPages = LEGAL_PAGES.filter((page) => page.label !== title && !title.startsWith(page.label));

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="px-4 pb-10 pt-10 text-center md:px-8 md:pb-14 md:pt-14">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
          <Link href="/" className="transition-colors hover:text-[var(--som-primary)]">
            Accueil
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-[var(--som-ink)]">{title}</span>
        </nav>
        <h1
          className="m-0 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[38px]"
          style={{ lineHeight: 1.15 }}
        >
          {title}
        </h1>
        <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
          Dernière mise à jour : {lastUpdated}
        </p>
      </header>

      <div className="mx-auto grid max-w-[1100px] gap-12 border-t border-[var(--som-border)] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14 lg:grid-cols-[220px_1fr] lg:gap-20">
        {/* Summary (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <LegalToc containerId="legal-content" />
          </div>
        </aside>

        <div className="min-w-0 max-w-[720px]">
          <article id="legal-content" className="legal-content">
            {children}
          </article>

          {/* Help */}
          <div className="mt-16 bg-[var(--som-primary-50)] px-6 py-8 md:px-10">
            <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-primary)]">Une question ?</p>
            <p className="m-0 mt-2 text-[18px] font-medium text-[var(--som-ink)]">Notre équipe vous répond sur WhatsApp</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                Écrire sur WhatsApp
              </a>
              <Link href="/contact" className="btn-link">
                Tous nos contacts
              </Link>
            </div>
          </div>

          {/* Other legal pages */}
          {otherPages.length > 0 && (
            <nav aria-label="À lire aussi" className="mt-12">
              <p className="m-0 mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">À lire aussi</p>
              <ul className="m-0 list-none p-0">
                {otherPages.map((page) => (
                  <li key={page.href} className="border-b border-[var(--som-border)]">
                    <Link
                      href={page.href}
                      className="flex min-h-12 items-center justify-between text-[15px] text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
                    >
                      {page.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
