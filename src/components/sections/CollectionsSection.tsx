"use client";

import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/products";

export function CollectionsSection() {
  // Show first 6 collections in 2 rows
  const displayCollections = collections.slice(0, 6);

  return (
    <section
      id="collections"
      className="section-padding"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "48px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "14px",
            }}
          >
            Explorez la maison
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(34px, 4vw, 56px)",
              lineHeight: 1,
              margin: 0,
              color: "#2a181d",
            }}
          >
            Nos collections
          </h2>
        </div>
        <Link
          href="/catalogue"
          style={{
            fontSize: "12.5px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#511F29",
            background: "none",
            cursor: "pointer",
            borderBottom: "1px solid rgba(81,31,41,0.35)",
            padding: "0 0 5px",
            fontFamily: "'Inter', sans-serif",
            transition: "opacity 0.25s",
            textDecoration: "none",
          }}
        >
          Voir tout
        </Link>
      </div>

      {/* Grid */}
      <div className="grid-cols-3-responsive">
        {displayCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/catalogue/${collection.slug}`}
            className="group"
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              aspectRatio: "4/5",
              overflow: "hidden",
              textDecoration: "none",
              background: "#2a181d",
            }}
          >
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="transition-transform duration-700 group-hover:scale-[1.07]"
              style={{ objectFit: "cover", objectPosition: "center 22%" }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(36,20,25,0) 38%, rgba(36,20,25,0.72) 100%)",
              }}
            />
            {/* Floating Logo Mark */}
            <div
              className="opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              style={{
                position: "absolute",
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)",
                width: "80px",
                height: "80px",
              }}
            >
              <Image
                src="/images/logo_mark.png"
                alt=""
                fill
                style={{ objectFit: "contain", opacity: 0.4 }}
              />
            </div>
            {/* Label Badge */}
            <div style={{ position: "absolute", top: "16px", left: "16px" }}>
              <span
                style={{
                  font: "500 10px/1 ui-monospace, Menlo, monospace",
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(36,20,25,0.4)",
                  padding: "6px 10px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                }}
              >
                {collection.label}
              </span>
            </div>
            {/* Content */}
            <div style={{ position: "absolute", left: "26px", right: "26px", bottom: "26px" }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: "30px",
                  color: "#fbf3ec",
                  margin: "0 0 6px",
                }}
              >
                {collection.name}
              </h3>
              <div style={{ fontSize: "12px", letterSpacing: "0.04em", color: "rgba(251,243,236,0.78)" }}>
                {collection.subtitle}
              </div>
              <div
                style={{
                  marginTop: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "11.5px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#fcd3b4",
                }}
              >
                Découvrir <span style={{ fontSize: "15px" }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
