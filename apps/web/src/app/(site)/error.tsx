"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export default function SiteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      code="500"
      title="Un imprévu est survenu"
      text="La page n'a pas pu se charger. Réessayez dans un instant ; si le problème continue, écrivez-nous sur WhatsApp."
      actions={
        <>
          <button type="button" onClick={() => unstable_retry()} className="btn-primary cursor-pointer">
            Réessayer
          </button>
          <Link href="/" className="btn-secondary">
            Retour à l&apos;accueil
          </Link>
        </>
      }
      footnote={error.digest ? `Référence : ${error.digest}` : undefined}
    />
  );
}
