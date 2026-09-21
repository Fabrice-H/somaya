import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accès refusé | SO'MAYA",
  robots: { index: false, follow: false },
};

export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--som-surface)] px-6 text-center">
      <div className="max-w-[420px]">
        <p className="m-0 mb-4 text-[11.5px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Erreur 403</p>
        <h1 className="m-0 text-[32px] font-medium tracking-[-0.01em] text-[var(--som-ink)]">Accès refusé</h1>
        <p className="mb-10 mt-4 text-[15px] font-light leading-[1.65] text-[var(--som-gray)]">
          Cette page est réservée aux administrateurs.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
