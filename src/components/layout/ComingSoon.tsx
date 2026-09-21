import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";

interface ComingSoonProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text: string;
}

// Placeholder page for features announced in the header but not built yet
export function ComingSoon({ icon: Icon, eyebrow, title, text }: ComingSoonProps) {
  return (
    <>
      <HeaderWrapper />
      <main className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">
          <Icon size={40} strokeWidth={1.25} aria-hidden className="text-[var(--som-primary)]" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">{eyebrow}</p>
          <h1 className="mt-3 text-[26px] font-semibold text-[var(--som-ink)] md:text-[32px]">{title}</h1>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">{text}</p>
          <p className="mt-2 text-[13px] text-[var(--som-gray)]">Bientôt disponible.</p>
          <Link
            href="/catalogue"
            className="btn-primary mt-8"
          >
            Découvrir la boutique
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
