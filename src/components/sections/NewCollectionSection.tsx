"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeFeaturedCollection } from "@/lib/queries/home";

// Default images for fallback
const DEFAULT_IMAGES = [
  "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  "/images/so_maya_ci_1718012343_3387255504255434625_13316418128-1819c16c.jpg",
  "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
];

interface NewCollectionSectionProps {
  data?: HomeFeaturedCollection | null;
}

// ============================================================
// Client Component - NewCollectionSection
// Design: Full-width burgundy section with content left, images right
// ============================================================

export default function NewCollectionSection({ data }: NewCollectionSectionProps) {
  if (data && !data.is_active) {
    return null;
  }

  const eyebrow = data?.eyebrow || "La nouvelle saison";
  const title = data?.title || "Collection Cérémonie 2026";
  const description = data?.description || "Boubous d'exception, satins profonds et broderies dorées. Une garde-robe pensée pour les grandes occasions comme pour l'éclat du quotidien.";
  const stat1Value = data?.stat1_value || "48";
  const stat1Label = data?.stat1_label || "Nouvelles pièces";
  const stat2Value = data?.stat2_value || "100%";
  const stat2Label = data?.stat2_label || "Fait main";
  const buttonText = data?.button_text || "Voir la collection";
  const buttonLink = data?.button_link || "/catalogue";
  const images = data?.images?.length ? data.images : DEFAULT_IMAGES;

  return (
    <section
      id="nouveautes"
      className="hidden md:block"
      style={{ background: "#511F29", color: "#fbf3ec", overflow: "hidden" }}
    >
      <div
        className="new-collection-grid"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(80px, 9vw, 128px) clamp(20px, 4vw, 40px)",
        }}
      >
        {/* Left Content */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#fcd3b4",
              marginBottom: "18px",
            }}
          >
            {eyebrow}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 4.4vw, 64px)",
              lineHeight: 1.02,
              margin: "0 0 22px",
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            style={{
              color: "rgba(251,243,236,0.78)",
              fontSize: "16.5px",
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: "440px",
            }}
          >
            {description}
          </p>

          {/* Stats */}
          {(stat1Value || stat2Value) && (
            <div style={{ display: "flex", gap: "36px", margin: "34px 0 38px" }}>
              {stat1Value && (
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
                      fontSize: "38px",
                      color: "#fcd3b4",
                      lineHeight: 1,
                    }}
                  >
                    {stat1Value}
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
                    {stat1Label}
                  </div>
                </div>
              )}
              {stat2Value && (
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
                      fontSize: "38px",
                      color: "#fcd3b4",
                      lineHeight: 1,
                    }}
                  >
                    {stat2Value}
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
                    {stat2Label}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Button */}
          <Link
            href={buttonLink}
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
            {buttonText}
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
            className="group"
            style={{
              position: "relative",
              aspectRatio: "3/4",
              gridRow: "span 2",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            {images[0] && (
              <Image
                src={images[0]}
                alt={title}
                fill
                className="transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: "cover", objectPosition: "center 20%" }}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            )}
            {/* Floating Logo Mark */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "48px",
                height: "48px",
              }}
            >
              <Image
                src="/images/logo_mark.png"
                alt=""
                fill
                style={{ objectFit: "contain", opacity: 0.6 }}
              />
            </div>
          </div>

          {/* Small Image 1 */}
          <div
            className="group"
            style={{
              position: "relative",
              aspectRatio: "1/1",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            {images[1] && (
              <Image
                src={images[1]}
                alt="Détail"
                fill
                className="transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: "cover", objectPosition: "center 18%" }}
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            )}
            {/* Floating Logo Mark */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "40px",
                height: "40px",
              }}
            >
              <Image
                src="/images/logo_mark.png"
                alt=""
                fill
                style={{ objectFit: "contain", opacity: 0.6 }}
              />
            </div>
          </div>

          {/* Small Image 2 */}
          <div
            className="group"
            style={{
              position: "relative",
              aspectRatio: "1/1",
              overflow: "hidden",
              background: "#3c161e",
            }}
          >
            {images[2] && (
              <Image
                src={images[2]}
                alt="Texture"
                fill
                className="transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            )}
            {/* Floating Logo Mark */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "40px",
                height: "40px",
              }}
            >
              <Image
                src="/images/logo_mark.png"
                alt=""
                fill
                style={{ objectFit: "contain", opacity: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
