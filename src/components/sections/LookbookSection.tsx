"use client";

import Image from "next/image";
import { lookbookItems } from "@/data/products";

export function LookbookSection() {
  return (
    <section
      id="lookbook"
      className="section-padding"
      style={{
        maxWidth: "1440px",
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
          marginBottom: "44px",
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
            Inspiration
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
            Le Lookbook
          </h2>
        </div>
        <p
          style={{
            fontSize: "14.5px",
            lineHeight: 1.7,
            color: "#6e5a50",
            fontWeight: 300,
            maxWidth: "340px",
            margin: 0,
          }}
        >
          Lifestyle, détails et textures — l&apos;univers SO&apos;MAYA en images.
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="masonry-4">
        {lookbookItems.map((item) => (
          <div
            key={item.id}
            className="group"
            style={{
              breakInside: "avoid",
              marginBottom: "16px",
              position: "relative",
              overflow: "hidden",
              background: "#e6d6c7",
              borderRadius: "2px",
            }}
          >
            <Image
              src={item.image}
              alt={item.label}
              width={400}
              height={parseInt(item.height || "400")}
              className="transition-transform duration-700 group-hover:scale-105"
              style={{
                display: "block",
                width: "100%",
                height: item.height || "400px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                padding: "16px",
                pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(36,20,25,0) 55%, rgba(36,20,25,0.5) 100%)",
              }}
            >
              <span
                style={{
                  font: "500 10px/1 ui-monospace, Menlo, monospace",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.88)",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
