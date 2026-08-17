"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createWhatsAppLink } from "@/data/products";

const stats = [
  { value: "1", label: "Année", prefix: "" },
  { value: "350", label: "Pièces", prefix: "+" },
  { value: "2", label: "Pop-Ups", prefix: "" },
  { value: "1", label: "Showroom", prefix: "" },
];

export function AboutContent() {
  const whatsappLink = createWhatsAppLink(
    "Bonjour, j'aimerais en savoir plus sur SO'MAYA et vos produits."
  );

  return (
    <div style={{ background: "#fff" }}>
      {/* Breadcrumb */}
      <div className="container-som" style={{ paddingTop: "clamp(30px, 4vw, 50px)" }}>
        <Breadcrumb items={[{ label: "Notre Histoire" }]} />
      </div>

      {/* Hero - Magazine Cover Style */}
      <section
        style={{
          position: "relative",
          height: "85vh",
          minHeight: "600px",
          maxHeight: "900px",
          marginTop: "20px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/so_maya_ci_1763665764_3770224151622122471_13316418128.jpg"
          alt="SO'MAYA"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(81,31,41,0.1) 0%, rgba(81,31,41,0.6) 70%, rgba(81,31,41,0.9) 100%)",
          }}
        />

        {/* Magazine-style content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "clamp(40px, 8vw, 100px)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-block",
                background: "var(--som-peach)",
                color: "var(--som-burgundy)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "8px 16px",
                marginBottom: "24px",
              }}
            >
              Édition Anniversaire
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(48px, 10vw, 120px)",
                lineHeight: 0.9,
                color: "#fff",
                margin: "0 0 24px",
                letterSpacing: "-0.03em",
              }}
            >
              SO&apos;MAYA
            </h1>

            <p
              style={{
                fontFamily: "var(--font-serif), serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 3vw, 32px)",
                color: "var(--som-peach)",
                margin: "0 0 40px",
                maxWidth: "500px",
              }}
            >
              La qualité, notre référence.
            </p>

            <div
              style={{
                display: "flex",
                gap: "clamp(30px, 5vw, 60px)",
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "clamp(36px, 5vw, 56px)",
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {stat.prefix}{stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      marginTop: "6px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote Section */}
      <section
        style={{
          padding: "clamp(80px, 12vw, 160px) 20px",
          background: "var(--som-cream)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.3,
              color: "var(--som-text)",
              fontStyle: "italic",
            }}
          >
            &ldquo;Nous croyons que chaque femme mérite de se sentir
            <span style={{ color: "var(--som-burgundy)" }}> belle </span>
            et
            <span style={{ color: "var(--som-burgundy)" }}> confiante</span>,
            à chaque moment de sa vie.&rdquo;
          </div>
          <div
            style={{
              marginTop: "32px",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--som-text-light)",
            }}
          >
            — Fondatrice de SO&apos;MAYA
          </div>
        </div>
      </section>

      {/* La Fondatrice Section */}
      <section style={{ background: "#fff" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "700px",
          }}
          className="grid-cols-1-mobile"
        >
          {/* Left - Image */}
          <div style={{ position: "relative", minHeight: "500px" }}>
            <Image
              src="/images/boss.jpg"
              alt="Fondatrice de SO'MAYA"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>

          {/* Right - Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(40px, 6vw, 80px)",
              background: "var(--som-cream)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-burgundy)",
                marginBottom: "20px",
              }}
            >
              La Fondatrice
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.1,
                color: "var(--som-text)",
                margin: "0 0 32px",
              }}
            >
              Une Vision,<br />
              <em style={{ fontStyle: "italic", color: "var(--som-burgundy)" }}>Une Passion</em>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--som-text-light)",
              }}
            >
              <p style={{ margin: 0 }}>
                Passionnée de mode depuis toujours, j&apos;ai créé SO&apos;MAYA avec
                une vision claire : offrir aux femmes ivoiriennes des pièces
                élégantes et de qualité, accessibles à toutes.
              </p>
              <p style={{ margin: 0 }}>
                Chaque article est sélectionné avec soin pour vous accompagner
                au quotidien — du bureau aux cérémonies, en passant par les
                moments entre amies.
              </p>
              <p style={{ margin: 0, fontStyle: "italic", color: "var(--som-burgundy)" }}>
                &ldquo;La mode en toute décence, c&apos;est notre signature.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Passion - Magazine Editorial Layout */}
      <section style={{ background: "#fff" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "700px",
          }}
          className="grid-cols-1-mobile"
        >
          {/* Left - Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(40px, 6vw, 80px)",
              background: "var(--som-burgundy)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-peach)",
                marginBottom: "20px",
              }}
            >
              Notre Passion
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.1,
                color: "#fff",
                margin: "0 0 32px",
              }}
            >
              La Mode en<br />
              <em style={{ fontStyle: "italic", color: "var(--som-peach)" }}>Toute Décence</em>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <p style={{ margin: 0 }}>
                Des tenues élégantes qui respectent les valeurs de chaque femme
                tout en sublimant son style unique.
              </p>
              <p style={{ margin: 0 }}>
                Nous célébrons le <strong style={{ color: "var(--som-peach)" }}>Glow Ivoirien</strong> —
                cette lumière intérieure qui rayonne à travers chaque pièce que nous créons.
              </p>
            </div>

            <div
              style={{
                marginTop: "48px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "16px",
                }}
              >
                Top Ventes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ color: "#fff", fontSize: "16px" }}>Boubous Fluide-Brocard</span>
                <span style={{ color: "#fff", fontSize: "16px" }}>Robes Chics</span>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div style={{ position: "relative", minHeight: "500px" }}>
            <Image
              src="/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg"
              alt="Notre Passion"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Nos Succès Section */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 100px) 20px",
          background: "var(--som-cream)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-burgundy)",
                marginBottom: "12px",
              }}
            >
              1 An de Style
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "var(--som-text)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Nos Succès...
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(24px, 4vw, 48px)",
            }}
            className="grid-cols-1-mobile"
          >
            {/* Nos Premières */}
            <div
              style={{
                background: "#fff",
                padding: "clamp(32px, 5vw, 48px)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "var(--som-burgundy)",
                }}
              />
              <h3
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--som-burgundy)",
                  marginBottom: "32px",
                  fontWeight: 600,
                }}
              >
                Nos Premières
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "20px",
                      color: "var(--som-text)",
                      marginBottom: "6px",
                    }}
                  >
                    Ventes Privées
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--som-text-light)", margin: 0 }}>
                    Des moments exclusifs avec nos clientes VIP
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "20px",
                      color: "var(--som-text)",
                      marginBottom: "6px",
                    }}
                  >
                    Ruptures de Stock
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--som-text-light)",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    Ouiiiiiii ! Et on adore 😁
                  </p>
                </div>
              </div>
            </div>

            {/* Nos Events */}
            <div
              style={{
                background: "var(--som-burgundy)",
                padding: "clamp(32px, 5vw, 48px)",
                position: "relative",
              }}
            >
              <h3
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--som-peach)",
                  marginBottom: "32px",
                  fontWeight: 600,
                }}
              >
                Nos Events
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "clamp(36px, 5vw, 48px)",
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                    Showroom
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "clamp(36px, 5vw, 48px)",
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    2
                  </span>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                    Pop-Ups Réussis
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "clamp(36px, 5vw, 48px)",
                      color: "var(--som-peach)",
                      lineHeight: 1,
                    }}
                  >
                    +350
                  </span>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                    Pièces Vendues
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Communauté Section */}
      <section style={{ background: "var(--som-cream)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            minHeight: "600px",
          }}
          className="grid-cols-1-mobile"
        >
          {/* Left - Image */}
          <div style={{ position: "relative", minHeight: "400px" }}>
            <Image
              src="/images/communaute.jpg"
              alt="La communauté SO'MAYA"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {/* Overlay badge */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "var(--som-burgundy)",
                color: "#fff",
                padding: "12px 20px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Pop-Up Anniversaire 2025
            </div>
          </div>

          {/* Right - Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(40px, 6vw, 80px)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-burgundy)",
                marginBottom: "20px",
              }}
            >
              Notre Communauté
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--som-text)",
                margin: "0 0 24px",
              }}
            >
              Une Belle<br />
              <em style={{ fontStyle: "italic", color: "var(--som-burgundy)" }}>Famille</em>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--som-text-light)",
              }}
            >
              <p style={{ margin: 0 }}>
                Plus qu&apos;une boutique, SO&apos;MAYA c&apos;est une communauté de
                femmes qui partagent les mêmes valeurs : l&apos;élégance, la qualité
                et le respect de soi.
              </p>
              <p style={{ margin: 0 }}>
                Un immense merci à toutes nos clientes formidables qui sont venues
                partager ce moment unique lors de notre pop-up anniversaire 2025.
              </p>
              <p style={{ margin: 0, fontWeight: 500, color: "var(--som-burgundy)" }}>
                Notre fierté : Vous ! Notre si belle communauté à qui nous devons tout.
              </p>
            </div>

            {/* Stats inline */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "40px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(81,31,41,0.1)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "36px",
                    fontWeight: 400,
                    color: "var(--som-burgundy)",
                    lineHeight: 1,
                  }}
                >
                  +350
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--som-text-light)",
                    marginTop: "6px",
                  }}
                >
                  Clientes satisfaites
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "36px",
                    fontWeight: 400,
                    color: "var(--som-burgundy)",
                    lineHeight: 1,
                  }}
                >
                  2
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--som-text-light)",
                    marginTop: "6px",
                  }}
                >
                  Événements réussis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anniversary Banner */}
      <section
        style={{
          position: "relative",
          padding: "clamp(80px, 12vw, 140px) 20px",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Large decorative text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(150px, 25vw, 400px)",
            fontWeight: 400,
            color: "var(--som-burgundy)",
            opacity: 0.03,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          MERCI
        </div>

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              border: "1px solid var(--som-burgundy)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "32px",
                color: "var(--som-burgundy)",
              }}
            >
              1
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-serif), serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.15,
              color: "var(--som-text)",
              margin: "0 0 24px",
            }}
          >
            An de Pur Bonheur
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: "var(--som-text-light)",
              margin: "0 0 48px",
              maxWidth: "550px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Merci à notre belle communauté qui nous soutient depuis le premier jour.
            Ensemble, continuons à célébrer l&apos;élégance ivoirienne.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--som-burgundy)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "18px 40px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            <MessageCircle size={18} />
            Nous contacter
          </a>
        </div>
      </section>

      {/* Location Strip */}
      <section
        style={{
          padding: "clamp(40px, 6vw, 60px) 20px",
          background: "var(--som-burgundy)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--som-peach)",
            marginBottom: "12px",
          }}
        >
          Rendez-nous visite
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            color: "#fff",
          }}
        >
          Angré Château, Abidjan — Côte d&apos;Ivoire
        </div>
        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "20px",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--som-peach)",
            textDecoration: "none",
          }}
        >
          Voir les informations
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
