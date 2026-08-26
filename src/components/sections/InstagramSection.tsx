import Image from "next/image";
import Link from "next/link";
import type { HomeInstagramData } from "@/lib/queries/home";

// Instagram SVG Icon
function InstagramIcon({ size = 24, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface InstagramSectionProps {
  data: HomeInstagramData;
}

// ============================================================
// Server Component - InstagramSection
// Design: Cream background, centered header
// ============================================================

export function InstagramSection({ data }: InstagramSectionProps) {
  const { posts, username, profileUrl } = data;

  return (
    <section style={{ background: "#f1e8df" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)",
        }}
      >
        {/* Header - Centered */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "12px",
            }}
          >
            Suivez-nous
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(28px, 3.5vw, 46px)",
              lineHeight: 1,
              margin: 0,
              color: "#2a181d",
            }}
          >
            @{username}
          </h2>
        </div>

        {/* Grid - 6 columns */}
        {posts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "12px",
            }}
            className="!grid-cols-3 md:!grid-cols-5"
          >
            {posts.slice(0, 6).map((post) => (
              <Link
                key={post.id}
                href={post.postUrl || profileUrl}
                target="_blank"
                className="group"
                style={{
                  position: "relative",
                  display: "block",
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  background: "#e6d6c7",
                  borderRadius: "4px",
                }}
              >
                <Image
                  src={post.image}
                  alt="SO'MAYA sur Instagram"
                  fill
                  className="transition-transform duration-700 group-hover:scale-[1.08]"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 33vw, 180px"
                />
                {/* Hover Overlay */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#511F29",
                    background: "rgba(252,211,180,0.55)",
                  }}
                >
                  <InstagramIcon size={24} strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder when no posts - 6 square boxes */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "12px",
            }}
            className="!grid-cols-3 md:!grid-cols-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Link
                key={i}
                href={profileUrl}
                target="_blank"
                className="group"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1/1",
                  background: "#511F29",
                  borderRadius: "4px",
                  transition: "transform 0.3s ease",
                }}
              >
                <div
                  className="group-hover:scale-110 transition-transform duration-300"
                  style={{
                    color: "#fcd3b4",
                    opacity: 0.9,
                  }}
                >
                  <InstagramIcon size={40} strokeWidth={1.2} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <Link
            href={profileUrl}
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              background: "#511F29",
              color: "#fcd3b4",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
            className="hover:bg-[#3d171f]"
          >
            <InstagramIcon size={16} strokeWidth={1.5} />
            Nous suivre sur Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
