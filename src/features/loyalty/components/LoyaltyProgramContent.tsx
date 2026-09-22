import Link from "next/link";
import { Gift, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { orderedLevels } from "../rules";
import type { LoyaltySettingsData } from "../types";

const STEPS = [
  { icon: ShoppingBag, title: "Commandez", text: "Sur la boutique, en livraison ou en retrait." },
  { icon: PackageCheck, title: "Recevez votre commande", text: "Vos points sont crédités dès la livraison." },
  { icon: Sparkles, title: "Montez de niveau", text: "Habitué, Fidèle puis VIP : des attentions réservées." },
];

export function LoyaltyProgramContent({ settings }: { settings: LoyaltySettingsData }) {
  const levels = orderedLevels(settings.levels);
  const example = settings.amountStep * 10;
  const examplePoints = Math.floor(example / settings.amountStep) * settings.pointsPerStep;

  return (
    <div className="bg-white">
      <header className="px-4 pb-12 pt-12 text-center md:px-8 md:pb-16 md:pt-16">
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Programme fidélité</p>
        <h1 className="m-0 mt-4 text-[clamp(30px,4.6vw,52px)] font-light leading-[1.1] tracking-[-0.01em] text-[var(--som-ink)]">
          Le Club <span className="font-medium">SO&apos;MAYA</span>
        </h1>
        <p className="mx-auto mb-0 mt-5 max-w-[520px] text-[15px] font-light leading-[1.7] text-[#4a4a4a]">
          Chaque commande livrée vous rapporte des points. Plus vous êtes fidèle, plus nous prenons soin de vous.
        </p>
      </header>

      <section className="border-t border-[var(--som-border)] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="m-0 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">
            Comment ça marche
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <div key={step.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[var(--som-primary)]">
                  <step.icon size={22} strokeWidth={1.3} aria-hidden />
                </span>
                <p className="m-0 mt-5 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">
                  Étape {index + 1}
                </p>
                <h2 className="m-0 mt-2 text-[18px] font-medium text-[var(--som-ink)]">{step.title}</h2>
                <p className="mx-auto mb-0 mt-2 max-w-[260px] text-[14px] font-light leading-relaxed text-[#4a4a4a]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--som-primary-50)] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">La règle</p>
            <p className="m-0 mt-4 text-[clamp(28px,4vw,44px)] font-light leading-[1.15] text-[var(--som-ink)]">
              <span className="font-medium">{settings.pointsPerStep}</span> point{settings.pointsPerStep > 1 ? "s" : ""}{" "}
              par tranche de <span className="font-medium">{formatPrice(settings.amountStep)}</span>
            </p>
            <p className="mb-0 mt-4 text-[14px] font-light leading-relaxed text-[#4a4a4a]">
              Calculé sur le montant de vos articles, hors livraison, une fois la commande livrée. Par exemple, une
              commande de {formatPrice(example)} vous rapporte {examplePoints} points.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-[var(--som-primary-200)] bg-white text-[var(--som-primary)]">
              <Gift size={30} strokeWidth={1.2} aria-hidden />
              <span className="mt-2 text-[11px] uppercase tracking-[0.24em]">Points</span>
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="m-0 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Les niveaux</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((level, index) => {
              const next = levels[index + 1];
              const isTop = !next;
              return (
                <div
                  key={level.key}
                  className={`border p-6 ${isTop ? "border-[var(--som-primary)] bg-[var(--som-primary)] text-white" : "border-[var(--som-border)] bg-white"}`}
                >
                  <p
                    className={`m-0 text-[11px] uppercase tracking-[0.24em] ${isTop ? "text-white/70" : "text-[var(--som-gray)]"}`}
                  >
                    Niveau {index + 1}
                  </p>
                  <h2 className={`m-0 mt-3 text-[22px] font-medium ${isTop ? "text-white" : "text-[var(--som-ink)]"}`}>
                    {level.label}
                  </h2>
                  <p className={`m-0 mt-2 text-[14px] font-light ${isTop ? "text-white/85" : "text-[#4a4a4a]"}`}>
                    {next
                      ? `De ${level.minPoints} à ${next.minPoints - 1} points`
                      : `À partir de ${level.minPoints} points`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--som-border)] px-4 py-14 text-center md:px-8 md:py-20">
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-gray)]">Bon à savoir</p>
        <p className="mx-auto mb-0 mt-4 max-w-[560px] text-[15px] font-light leading-[1.7] text-[#4a4a4a]">
          Vos points sont rattachés à votre numéro de téléphone. Votre espace client, pour suivre votre solde et vos
          commandes, arrive bientôt. En attendant, notre équipe vous renseigne sur WhatsApp.
        </p>
        <Link href="/catalogue" className="btn-primary mt-8">
          Découvrir la boutique
        </Link>
      </section>
    </div>
  );
}
