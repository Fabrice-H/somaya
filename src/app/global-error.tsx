"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500"] });

export default function GlobalError({
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
    <html lang="fr" className={poppins.variable}>
      <body className="min-h-screen bg-white antialiased">
        <title>Erreur | SO&apos;MAYA</title>
        <ErrorState
          code="500"
          title="Le site est momentanément indisponible"
          text="Nous faisons le nécessaire pour rétablir la boutique au plus vite. Merci de réessayer dans quelques instants."
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
      </body>
    </html>
  );
}
