import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/shared/components/layout/SiteShell";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export const metadata: Metadata = {
  title: "Page introuvable | SO'MAYA",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <ErrorState
        code="404"
        title="Cette page est introuvable"
        text="Le lien est peut-être incorrect ou la pièce n'est plus disponible. Nos nouveautés vous attendent dans la boutique."
        actions={
          <>
            <Link href="/catalogue" className="btn-primary">
              Voir la boutique
            </Link>
            <Link href="/" className="btn-secondary">
              Retour à l&apos;accueil
            </Link>
          </>
        }
      />
    </SiteShell>
  );
}
