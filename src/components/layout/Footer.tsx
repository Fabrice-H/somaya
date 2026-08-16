"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      style={{
        background: "#f8f5f2",
        color: "#2a181d",
        fontFamily: "var(--font-body), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(60px, 7vw, 90px) clamp(20px, 4vw, 48px) 0",
        }}
      >
        {/* Main Footer Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "clamp(32px, 5vw, 80px)",
            paddingBottom: "60px",
            borderBottom: "1px solid rgba(42, 24, 29, 0.1)",
          }}
        >
          {/* Brand Column */}
          <div>
            <Image
              src="/images/logo_header.png"
              alt="SO'MAYA"
              width={140}
              height={35}
              style={{ height: "35px", width: "auto", display: "block" }}
            />
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#6b5a52",
                maxWidth: "280px",
                margin: "24px 0 0",
              }}
            >
              Le luxe accessible, depuis Abidjan. Des pièces d&apos;exception confectionnées avec soin dans notre atelier.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2a181d",
                marginBottom: "24px",
                fontWeight: 500,
              }}
            >
              Navigation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link
                href="/catalogue"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Boutique
              </Link>
              <Link
                href="/a-propos"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Notre Histoire
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Informations Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2a181d",
                marginBottom: "24px",
                fontWeight: 500,
              }}
            >
              Informations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link
                href="/livraison-retours"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Livraison & Retours
              </Link>
              <Link
                href="/conditions-generales"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Conditions Générales
              </Link>
              <Link
                href="/politique-confidentialite"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Politique de Confidentialité
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2a181d",
                marginBottom: "24px",
                fontWeight: 500,
              }}
            >
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Angré Château
                <br />
                Abidjan, Côte d&apos;Ivoire
              </p>
              <a
                href="tel:+2250778784268"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                }}
              >
                +225 07 78 78 42 68
              </a>
              <a
                href="https://wa.me/2250508905666"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "14px",
                  color: "#6b5a52",
                  textDecoration: "none",
                }}
              >
                +225 05 08 90 56 66
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 0",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#9c8a82",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            © 2026 SO&apos;MAYA. TOUS DROITS RÉSERVÉS.
          </p>
          <div style={{ display: "flex", gap: "32px" }}>
            <a
              href="https://www.instagram.com/so_maya_ci/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6b5a52",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/MadeyaCado"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6b5a52",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Facebook
            </a>
            <a
              href="https://www.tiktok.com/@somayashop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6b5a52",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        .footer-grid {
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
