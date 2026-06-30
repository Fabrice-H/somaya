"use client";

import Image from "next/image";
import Link from "next/link";

export default function NewCollectionSection() {
  return (
    <section id="nouveautes" style={{ background: "#511F29", color: "#fbf3ec", overflow: "hidden" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(80px, 9vw, 128px) 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}
      >
        {/* Left Content */}
        <div>
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#fcd3b4",
              marginBottom: "18px",
            }}
          >
            La nouvelle saison
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 4.4vw, 64px)",
              lineHeight: 1.02,
              margin: "0 0 22px",
            }}
          >
            Collection Cérémonie 2026
          </h2>
          <p
            style={{
              color: "rgba(251,243,236,0.78)",
              fontSize: "16.5px",
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: "440px",
            }}
          >
            Boubous d&apos;exception, satins profonds et broderies dorées. Une garde-robe pensée pour les grandes occasions comme pour l&apos;éclat du quotidien.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "36px", margin: "34px 0 38px" }}>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "38px",
                  color: "#fcd3b4",
                  lineHeight: 1,
                }}
              >
                48
              </div>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(251,243,236,0.6)",
                  marginTop: "6px",
                }}
              >
                Nouvelles pièces
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "38px",
                  color: "#fcd3b4",
                  lineHeight: 1,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(251,243,236,0.6)",
                  marginTop: "6px",
                }}
              >
                Fait main
              </div>
            </div>
          </div>

          <Link
            href="#ventes"
            style={{
              display: "inline-block",
              background: "#fcd3b4",
              color: "#511F29",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "17px 36px",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "all 0.3s",
            }}
          >
            Voir la collection
          </Link>
        </div>

        {/* Right Images Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "16px",
          }}
        >
          {/* Large Image */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              gridRow: "span 2",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            <Image
              src="/images/products/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg"
              alt="Collection Cérémonie"
              fill
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          {/* Small Image 1 */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1/1",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            <Image
              src="/images/products/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg"
              alt="Détail"
              fill
              style={{ objectFit: "cover", objectPosition: "center 18%" }}
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          </div>
          {/* Small Image 2 */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1/1",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            <Image
              src="/images/products/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg"
              alt="Texture"
              fill
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
