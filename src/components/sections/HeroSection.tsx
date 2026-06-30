"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      {/* Desktop Hero - 2 columns */}
      <section
        className="hero-desktop"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          minHeight: "600px",
          height: "88vh",
          maxHeight: "880px",
        }}
      >
        {/* Left Side - Content */}
        <div
          style={{
            background: "#511F29",
            display: "flex",
            alignItems: "center",
            padding: "60px clamp(40px, 6vw, 96px)",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-block",
                fontSize: "11.5px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#fcd3b4",
                marginBottom: "26px",
                borderBottom: "1px solid rgba(252,211,180,0.4)",
                paddingBottom: "7px",
              }}
            >
              Maison de mode · Abidjan
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                color: "#fbf3ec",
                fontSize: "clamp(40px, 4.6vw, 76px)",
                lineHeight: 1.04,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              L&apos;élégance
              <br />
              <em style={{ fontStyle: "italic", color: "#fcd3b4" }}>commence</em> ici.
            </h1>

            {/* Description */}
            <p
              style={{
                color: "rgba(251,243,236,0.8)",
                fontSize: "17px",
                lineHeight: 1.65,
                margin: "28px 0 38px",
                fontWeight: 300,
              }}
            >
              Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link
                href="#collections"
                style={{
                  background: "#fcd3b4",
                  color: "#511F29",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "17px 34px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                }}
              >
                Découvrir la collection
              </Link>
              <Link
                href="#nouveautes"
                style={{
                  background: "transparent",
                  color: "#fbf3ec",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "17px 34px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  border: "1px solid rgba(251,243,236,0.45)",
                  transition: "all 0.3s",
                }}
              >
                Nos nouveautés
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div style={{ position: "relative", overflow: "hidden", background: "#ece0d3" }}>
          <Image
            src="/images/products/so_maya_ci_1718189738_3388743601078095746_13316418128.jpg"
            alt="SO'MAYA — boubou de cérémonie"
            fill
            style={{ objectFit: "cover", objectPosition: "center 22%" }}
            priority
          />
        </div>
      </section>

      {/* Mobile Hero - Full screen with overlay */}
      <section
        className="hero-mobile"
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "600px",
          maxHeight: "900px",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Image
          src="/images/products/so_maya_ci_1718189738_3388743601078095746_13316418128.jpg"
          alt="SO'MAYA — boubou de cérémonie"
          fill
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          priority
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(42,24,29,0.3) 0%, rgba(42,24,29,0.1) 40%, rgba(42,24,29,0.6) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(251,243,236,0.85)",
              marginBottom: "20px",
            }}
          >
            Collection 2026
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              color: "#fbf3ec",
              fontSize: "clamp(42px, 12vw, 72px)",
              lineHeight: 1,
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            L&apos;Élégance
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(20px, 5vw, 28px)",
              color: "rgba(251,243,236,0.9)",
              margin: "8px 0 0",
              fontWeight: 300,
            }}
          >
            est une attitude
          </p>

          {/* CTA Button */}
          <Link
            href="#collections"
            style={{
              marginTop: "40px",
              background: "transparent",
              color: "#fbf3ec",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "18px 40px",
              textDecoration: "none",
              border: "1px solid rgba(251,243,236,0.5)",
              transition: "all 0.3s",
            }}
          >
            Découvrir la collection
          </Link>
        </div>
      </section>
    </>
  );
}
