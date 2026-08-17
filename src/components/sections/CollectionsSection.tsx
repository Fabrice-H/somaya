"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomePageCategory } from "@/lib/queries/home";

// ============================================================
// Types
// ============================================================

interface CollectionsSectionProps {
  categories: HomePageCategory[];
}

// Default fallback images based on category slug
const FALLBACK_IMAGES: Record<string, string> = {
  sacs: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  femmes: "/images/so_maya_ci_1718012343_3387255504255434625_13316418128-1819c16c.jpg",
  hommes: "/images/boss.jpg",
  boubous: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  bijoux: "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
  montres: "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
  default: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
};

// Get image URL with fallback
function getCategoryImage(category: HomePageCategory): string {
  if (category.imageUrl) return category.imageUrl;
  return FALLBACK_IMAGES[category.slug] || FALLBACK_IMAGES.default;
}

// ============================================================
// Client Component - CollectionsSection
// Design: 3-column grid with elegant cards (matching old design)
// ============================================================

export function CollectionsSection({ categories }: CollectionsSectionProps) {
  const displayCategories = categories.slice(0, 6);

  if (displayCategories.length === 0) {
    return null;
  }

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
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
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
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            transition: "opacity 0.25s",
            textDecoration: "none",
          }}
        >
          Voir tout
        </Link>
      </div>

      {/* Grid - 3 columns responsive */}
      <div className="grid-cols-3-responsive">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogue/${category.slug}`}
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
            {/* Image */}
            <Image
              src={getCategoryImage(category)}
              alt={category.name}
              fill
              className="transition-transform duration-700 group-hover:scale-[1.07]"
              style={{ objectFit: "cover", objectPosition: "center 22%" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Gradient Overlay */}
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
                Collection
              </span>
            </div>

            {/* Content */}
            <div style={{ position: "absolute", left: "26px", right: "26px", bottom: "26px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: "30px",
                  color: "#fbf3ec",
                  margin: "0 0 6px",
                }}
              >
                {category.name}
              </h3>
              <div style={{ fontSize: "12px", letterSpacing: "0.04em", color: "rgba(251,243,236,0.78)" }}>
                {category.description || "Pièces uniques sélectionnées"}
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
