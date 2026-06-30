"use client";

import Link from "next/link";

export default function StorySection() {
  return (
    <section id="histoire" style={{ background: "#2a181d", color: "#fbf3ec", overflow: "hidden" }}>
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "clamp(90px, 11vw, 150px) 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#fcd3b4",
            marginBottom: "30px",
          }}
        >
          Notre histoire
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 5vw, 72px)",
            lineHeight: 1.08,
            margin: "0 auto",
            maxWidth: "900px",
            letterSpacing: "-0.01em",
          }}
        >
          L&apos;élégance comme signature.
        </h2>
        <p
          style={{
            color: "rgba(251,243,236,0.78)",
            fontSize: "clamp(16px, 1.6vw, 19px)",
            lineHeight: 1.85,
            fontWeight: 300,
            maxWidth: "660px",
            margin: "34px auto 0",
          }}
        >
          Née à Abidjan, SO&apos;MAYA réunit le raffinement contemporain et la richesse du style africain. Chaque pièce est choisie pour sa matière, sa coupe et son histoire — pour que celles et ceux qui la portent rayonnent de confiance. Plus qu&apos;une boutique, une maison où la qualité est une promesse tenue.
        </p>
        <Link
          href="#"
          style={{
            display: "inline-block",
            marginTop: "42px",
            color: "#fcd3b4",
            fontSize: "12.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderBottom: "1px solid rgba(252,211,180,0.4)",
            paddingBottom: "7px",
            transition: "opacity 0.25s",
          }}
        >
          Découvrir la maison
        </Link>
      </div>
    </section>
  );
}
