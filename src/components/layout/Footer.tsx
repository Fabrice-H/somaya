"use client";

import Link from "next/link";
import Image from "next/image";
import { collections } from "@/data/products";

export function Footer() {
  return (
    <footer id="contact" style={{ background: "#1f1116", color: "#e9dcd3" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(64px, 7vw, 90px) clamp(20px, 4vw, 40px) 0",
        }}
      >
        {/* Main Footer Grid */}
        <div
          className="footer-grid"
          style={{
            paddingBottom: "56px",
            borderBottom: "1px solid rgba(233,220,211,0.12)",
          }}
        >
          {/* Brand Column */}
          <div>
            <Image
              src="/images/logo_transparent.png"
              alt="SO'MAYA — La qualité, notre référence"
              width={168}
              height={78}
              style={{ height: "78px", width: "auto", display: "block" }}
            />
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#9c8579",
                fontWeight: 300,
                maxWidth: "300px",
                margin: "22px 0 0",
              }}
            >
              Prêt-à-porter Made in Africa. Afro-moderne, classe.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginTop: "18px" }}>
              <a
                href="https://wa.me/2250778784268"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "13.5px",
                  color: "#fcd3b4",
                  textDecoration: "none",
                  transition: "color 0.25s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9z" />
                </svg>
                +225 07 78 78 42 68
              </a>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "13px",
                  color: "#9c8579",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Abidjan, Côte d&apos;Ivoire 🇨🇮
              </span>
            </div>
          </div>

          {/* Boutique Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#fcd3b4",
                marginBottom: "20px",
              }}
            >
              Boutique
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              {collections.slice(0, 5).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/catalogue/${collection.slug}`}
                  style={{
                    fontSize: "13.5px",
                    color: "#c9b3a6",
                    textDecoration: "none",
                    transition: "color 0.25s",
                  }}
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Aide Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#fcd3b4",
                marginBottom: "20px",
              }}
            >
              Aide
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Livraison
              </Link>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Retours
              </Link>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Guide des tailles
              </Link>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Contact
              </Link>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                FAQ
              </Link>
            </div>
          </div>

          {/* La maison Column */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#fcd3b4",
                marginBottom: "20px",
              }}
            >
              La maison
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <Link href="#histoire" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Notre histoire
              </Link>
              <Link href="#" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Boutique Abidjan
              </Link>
              <Link href="#lookbook" style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}>
                Lookbook
              </Link>
              <a
                href="https://www.instagram.com/so_maya_ci/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "13.5px", color: "#c9b3a6", textDecoration: "none" }}
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom"
          style={{
            padding: "26px 0",
          }}
        >
          <div style={{ fontSize: "12px", color: "#8a7468" }}>
            © 2026 SO&apos;MAYA · Tous droits réservés · Conçu à Abidjan
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a
              href="https://www.instagram.com/so_maya_ci/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "#c9b3a6",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              Instagram
            </a>
            <a
              href="https://wa.me/2250508905666"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "#c9b3a6",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              WhatsApp
            </a>
            <a
              href="https://www.facebook.com/MadeyaCado"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "#c9b3a6",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              Facebook
            </a>
            <a
              href="https://www.tiktok.com/@somayashop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "#c9b3a6",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              TikTok
            </a>
            <Link
              href="#"
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "#c9b3a6",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
