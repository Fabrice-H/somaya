"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export default function AdminError({
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
      compact
      code="500"
      title="Cette page n'a pas pu se charger"
      text="Vos données ne sont pas perdues. Réessayez ; si le problème continue, transmettez la référence ci-dessous."
      actions={
        <>
          <button type="button" onClick={() => unstable_retry()} className="btn-primary cursor-pointer">
            Réessayer
          </button>
          <Link href="/admin" className="btn-secondary">
            Tableau de bord
          </Link>
        </>
      }
      footnote={error.digest ? `Référence : ${error.digest}` : undefined}
    />
  );
}
