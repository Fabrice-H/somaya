"use client";

import Image from "next/image";
import { MessageCircle, Award, Heart, Sparkles, Users, Truck, Shield } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createWhatsAppLink } from "@/data/products";

const values = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Qualité Premium",
    description:
      "Chaque article est soigneusement sélectionné pour sa qualité exceptionnelle et son élégance intemporelle.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Style Africain Moderne",
    description:
      "Nous célébrons la beauté et l'héritage africain tout en embrassant les tendances contemporaines.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Élégance Quotidienne",
    description:
      "Des pièces pour toutes les occasions - du bureau aux cérémonies. Chaque femme mérite de se sentir belle.",
  },
];

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Service Personnalisé",
    description: "Un accompagnement sur mesure pour trouver les pièces parfaites.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Livraison Abidjan",
    description: "Livraison rapide et soignée dans toute la ville d'Abidjan.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Qualité Garantie",
    description: "Tous nos produits sont vérifiés pour garantir votre satisfaction.",
  },
];

export function AboutContent() {
  const whatsappLink = createWhatsAppLink(
    "Bonjour, j'aimerais en savoir plus sur SO'MAYA et vos produits."
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-som" style={{ paddingTop: "clamp(30px, 4vw, 50px)" }}>
        <Breadcrumb items={[{ label: "À propos" }]} />
      </div>

      {/* Hero Section with Image */}
      <section
        style={{
          position: "relative",
          minHeight: "500px",
          marginTop: "30px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/so_maya_ci_1763665764_3770224151622122471_13316418128.jpg"
          alt="SO'MAYA - Mode africaine"
          fill
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(81,31,41,0.4) 0%, rgba(81,31,41,0.7) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "700px" }}>
            <div
              style={{
                fontSize: "11.5px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-peach)",
                marginBottom: "20px",
              }}
            >
              Notre Histoire
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                fontSize: "clamp(38px, 5vw, 64px)",
                lineHeight: 1.1,
                color: "#fff",
                margin: "0 0 24px",
              }}
            >
              Bienvenue chez SO&apos;MAYA
            </h1>
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
                fontWeight: 300,
              }}
            >
              Votre boutique de référence pour sublimer votre style au quotidien.
              Découvrez notre passion pour la mode féminine africaine.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding" style={{ background: "var(--som-cream)" }}>
        <div className="container-som">
          <div className="grid-cols-2-responsive" style={{ gap: "clamp(40px, 6vw, 100px)" }}>
            {/* Image */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/5",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg"
                  alt="L'histoire de SO'MAYA"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "-20px",
                  width: "180px",
                  height: "180px",
                  border: "1px solid var(--som-burgundy)",
                  opacity: 0.2,
                  zIndex: -1,
                }}
              />
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="section-eyebrow-burgundy">Qui Sommes-Nous</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  lineHeight: 1.15,
                  color: "var(--som-text)",
                  margin: "0 0 28px",
                }}
              >
                Une Passion pour l&apos;Élégance
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "var(--som-text-light)",
                }}
              >
                <p style={{ margin: 0 }}>
                  Chez SO&apos;MAYA, nous croyons que chaque femme mérite de se sentir
                  belle et confiante. C&apos;est pourquoi nous avons créé une collection
                  unique d&apos;articles de mode et d&apos;accessoires soigneusement
                  sélectionnés.
                </p>
                <p style={{ margin: 0 }}>
                  Notre mission est simple : vous offrir des pièces de qualité
                  qui subliment votre style au quotidien, que ce soit pour une
                  journée au bureau, une sortie entre amies ou une cérémonie
                  spéciale.
                </p>
                <p style={{ margin: 0 }}>
                  Basée à Abidjan, notre boutique s&apos;inspire de l&apos;élégance africaine
                  moderne tout en restant accessible. Chaque bijou, sac, tunique
                  ou accessoire est choisi avec soin pour répondre aux attentes
                  des femmes exigeantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="section-padding"
        style={{ background: "var(--som-burgundy)" }}
      >
        <div className="container-som">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-eyebrow-peach">Nos Valeurs</div>
            <h2 className="section-title-light">Ce Qui Nous Définit</h2>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: "40px" }}>
            {values.map((value) => (
              <div key={value.title} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-peach)",
                    margin: "0 auto 24px",
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "var(--som-peach)",
                    marginBottom: "14px",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                  }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ background: "var(--som-cream)" }}>
        <div className="container-som">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-eyebrow-burgundy">Pourquoi Nous Choisir</div>
            <h2 className="section-title">L&apos;Expérience SO&apos;MAYA</h2>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: "24px" }}>
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{
                  background: "#fff",
                  padding: "32px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--som-peach-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-burgundy)",
                    marginBottom: "20px",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "var(--som-text)",
                    marginBottom: "10px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "var(--som-text-light)",
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ background: "#fff" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
          <div className="section-eyebrow-burgundy">Contactez-Nous</div>
          <h2 className="section-title" style={{ marginBottom: "20px" }}>
            Prête à Sublimer Votre Style ?
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--som-text-light)",
              marginBottom: "36px",
            }}
          >
            N&apos;hésitez pas à nous contacter pour toute question ou pour
            découvrir nos dernières nouveautés. Notre équipe est là pour vous
            accompagner.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
