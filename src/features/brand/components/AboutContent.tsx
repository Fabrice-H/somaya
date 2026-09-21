import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/shared/lib/utils";

// ============================================================
// Content
// ============================================================

const KEY_FIGURES = [
  { value: "1", label: "Année" },
  { value: "+350", label: "Pièces vendues" },
  { value: "2", label: "Pop-ups réussis" },
  { value: "1", label: "Showroom" },
];

const FIRSTS = [
  { title: "Ventes privées", text: "Des moments exclusifs avec nos clientes VIP." },
  { title: "Ruptures de stock", text: "Ouiiiiiii ! Et on adore." },
];

// Shared typography (same system as the home sections)
const eyebrow = "m-0 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--som-primary)]";
const title =
  "m-0 mt-4 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[34px]";
const body = "text-[15px] font-light leading-[1.85] text-[#4a4a4a]";

// ============================================================
// AboutContent - editorial layout
// ============================================================

export function AboutContent() {
  const whatsappLink = createWhatsAppLink("Bonjour, j'aimerais en savoir plus sur SO'MAYA et vos produits.");

  return (
    <div className="bg-white">
      {/* Opening */}
      <header className="px-4 pb-10 pt-10 text-center md:px-8 md:pb-14 md:pt-14">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
          <Link href="/" className="transition-colors hover:text-[var(--som-primary)]">
            Accueil
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-[var(--som-ink)]">La marque</span>
        </nav>
        <h1
          className="m-0 text-[34px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[52px]"
          style={{ lineHeight: 1.1 }}
        >
          SO&apos;MAYA
        </h1>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.3em] text-[var(--som-gray)] md:text-[15px]">
          La qualité, notre référence
        </p>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--som-primary-50)] md:aspect-[16/7]">
          <Image
            src="/images/so_maya_ci_1763665764_3770224151622122471_13316418128.jpg"
            alt="L'univers SO'MAYA"
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="object-cover"
            style={{ objectPosition: "center 25%" }}
          />
        </div>
      </div>

      {/* Founder's quote */}
      <section className="px-4 py-20 md:py-28">
        <figure className="m-0 mx-auto max-w-[820px] text-center">
          <blockquote className="m-0 text-[22px] font-light italic leading-[1.5] text-[var(--som-ink)] md:text-[32px]">
            « Nous croyons que chaque femme mérite de se sentir{" "}
            <span className="text-[var(--som-primary)]">belle</span> et{" "}
            <span className="text-[var(--som-primary)]">confiante</span>, à chaque moment de sa vie. »
          </blockquote>
          <figcaption className="mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">
            Fondatrice de SO&apos;MAYA
          </figcaption>
        </figure>
      </section>

      {/* The founder */}
      <Story
        image="/images/boss.jpg"
        imageAlt="La fondatrice de SO'MAYA"
        imagePosition="center top"
        eyebrowText="La fondatrice"
        heading="Une vision, une passion"
      >
        <p className="m-0">
          Passionnée de mode depuis toujours, j&apos;ai créé SO&apos;MAYA avec une vision claire : offrir aux femmes
          ivoiriennes des pièces élégantes et de qualité, accessibles à toutes.
        </p>
        <p className="m-0">
          Chaque article est sélectionné avec soin pour vous accompagner au quotidien — du bureau aux cérémonies, en
          passant par les moments entre amies.
        </p>
        <p className="m-0 font-normal italic text-[var(--som-primary)]">
          « La mode en toute décence, c&apos;est notre signature. »
        </p>
      </Story>

      {/* Our passion */}
      <Story
        reverse
        image="/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg"
        imageAlt="Une création SO'MAYA"
        eyebrowText="Notre passion"
        heading="La mode en toute décence"
      >
        <p className="m-0">
          Des tenues élégantes qui respectent les valeurs de chaque femme tout en sublimant son style unique.
        </p>
        <p className="m-0">
          Nous célébrons le <span className="font-normal text-[var(--som-ink)]">Glow Ivoirien</span> — cette lumière
          intérieure qui rayonne à travers chaque pièce que nous créons.
        </p>
        <div className="mt-4 border-t border-[var(--som-border)] pt-6">
          <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Top ventes</p>
          <ul className="m-0 mt-3 list-none p-0 text-[16px] font-normal text-[var(--som-ink)]">
            <li className="py-1">Boubous Fluide-Brocard</li>
            <li className="py-1">Robes Chics</li>
          </ul>
        </div>
      </Story>

      {/* Key figures */}
      <section aria-labelledby="figures-title" className="mt-20 bg-[var(--som-primary-50)] px-4 py-16 md:mt-28 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <p className={eyebrow}>1 an de style</p>
            <h2 id="figures-title" className={title}>
              Nos succès
            </h2>
          </div>

          <dl className="m-0 mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {KEY_FIGURES.map((figure, index) => (
              <div
                key={figure.label}
                className={`flex flex-col-reverse items-center text-center ${
                  index > 0 ? "md:border-l md:border-[var(--som-primary-100)]" : ""
                }`}
              >
                <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#4a4a4a]">{figure.label}</dt>
                <dd className="m-0 text-[38px] font-light leading-none text-[var(--som-primary)] tabular-nums md:text-[48px]">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-14 grid max-w-[760px] gap-8 border-t border-[var(--som-primary-100)] pt-10 md:grid-cols-2 md:gap-12">
            <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)] text-center md:col-span-2">
              Nos premières
            </p>
            {FIRSTS.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="m-0 text-[17px] font-medium text-[var(--som-ink)]">{item.title}</h3>
                <p className="m-0 mt-1.5 text-[14px] font-light text-[#4a4a4a]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <div className="pt-20 md:pt-28">
        <Story
          image="/images/communaute.jpg"
          imageAlt="La communauté SO'MAYA lors du pop-up anniversaire 2025"
          imageLabel="Pop-up anniversaire 2025"
          eyebrowText="Notre communauté"
          heading="Une belle famille"
        >
          <p className="m-0">
            Plus qu&apos;une boutique, SO&apos;MAYA c&apos;est une communauté de femmes qui partagent les mêmes valeurs :
            l&apos;élégance, la qualité et le respect de soi.
          </p>
          <p className="m-0">
            Un immense merci à toutes nos clientes formidables qui sont venues partager ce moment unique lors de notre
            pop-up anniversaire 2025.
          </p>
          <p className="m-0 font-normal text-[var(--som-primary)]">
            Notre fierté : vous ! Notre si belle communauté à qui nous devons tout.
          </p>
          <dl className="m-0 mt-4 flex gap-12 border-t border-[var(--som-border)] pt-6">
            {[
              { value: "+350", label: "Clientes satisfaites" },
              { value: "2", label: "Événements réussis" },
            ].map((figure) => (
              <div key={figure.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">{figure.label}</dt>
                <dd className="m-0 text-[32px] font-light leading-none text-[var(--som-primary)] tabular-nums">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </Story>
      </div>

      {/* Thank you */}
      <section className="px-4 py-20 text-center md:py-28">
        <div className="mx-auto max-w-[620px]">
          <p className={eyebrow}>Merci</p>
          <h2 className={title}>1 an de pur bonheur</h2>
          <p className={`${body} mx-auto mt-5 max-w-[520px]`}>
            Merci à notre belle communauté qui nous soutient depuis le premier jour. Ensemble, continuons à célébrer
            l&apos;élégance ivoirienne.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-10">
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
            Nous contacter
          </a>
        </div>
      </section>

      {/* Visit us */}
      <section className="border-t border-[var(--som-primary-100)] bg-[var(--som-primary-50)] px-4 py-12 text-center md:py-14">
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Rendez-nous visite</p>
        <p className="m-0 mt-3 text-[18px] font-normal text-[var(--som-ink)] md:text-[22px]">
          Angré Château, Abidjan — Côte d&apos;Ivoire
        </p>
        <Link href="/contact" className="btn-link mt-4">
          Voir les informations
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

// ============================================================
// Story block: photo + text, alternating sides
// ============================================================

function Story({
  image,
  imageAlt,
  imagePosition = "center",
  imageLabel,
  eyebrowText,
  heading,
  reverse = false,
  children,
}: {
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageLabel?: string;
  eyebrowText: string;
  heading: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 md:px-8 [&+&]:mt-20 md:[&+&]:mt-28">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div className={`relative aspect-[4/5] w-full overflow-hidden bg-[var(--som-primary-50)] ${reverse ? "md:order-2" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          {imageLabel && (
            <span className="absolute bottom-4 left-4 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--som-ink)]">
              {imageLabel}
            </span>
          )}
        </div>

        <div className={`max-w-[480px] ${reverse ? "md:order-1 md:justify-self-end" : ""}`}>
          <p className={eyebrow}>{eyebrowText}</p>
          <h2 className={title}>{heading}</h2>
          <div className={`${body} mt-6 flex flex-col gap-4`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
