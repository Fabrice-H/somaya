import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SO'MAYA | La Qualité, Notre Référence",
  description:
    "Découvrez SO'MAYA, votre destination mode à Abidjan. Bijoux, sacs, montres, tuniques et boubous sélectionnés avec soin. L'élégance africaine moderne.",
  keywords: [
    "mode africaine",
    "bijoux Abidjan",
    "sacs femme Côte d'Ivoire",
    "boubou moderne",
    "tuniques africaines",
    "montres femme Abidjan",
    "accessoires mode Abidjan",
    "SO'MAYA",
  ],
  openGraph: {
    title: "SO'MAYA | La Qualité, Notre Référence",
    description:
      "L'élégance africaine moderne. Bijoux, sacs, montres et vêtements de qualité premium.",
    locale: "fr_CI",
    type: "website",
    siteName: "SO'MAYA",
  },
  twitter: {
    card: "summary_large_image",
    title: "SO'MAYA | La Qualité, Notre Référence",
    description: "L'élégance africaine moderne.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
