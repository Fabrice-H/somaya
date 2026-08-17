import Image from "next/image";
import Link from "next/link";
import type { HomeInstagramData } from "@/lib/queries/home";

interface InstagramSectionProps {
  data: HomeInstagramData;
}

// ============================================================
// Server Component - InstagramSection
// Design: Cream background, centered header (matching old design)
// ============================================================

export function InstagramSection({ data }: InstagramSectionProps) {
  const { posts, username, profileUrl } = data;

  if (posts.length === 0) return null;

  return (
    <section style={{ background: "#f1e8df" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "clamp(80px, 9vw, 120px) clamp(20px, 4vw, 40px)",
        }}
      >
        {/* Header - Centered */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "14px",
            }}
          >
            Suivez-nous
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 52px)",
              lineHeight: 1,
              margin: "0 0 10px",
              color: "#2a181d",
            }}
          >
            @{username}
          </h2>
          <Link
            href={profileUrl}
            target="_blank"
            style={{
              fontSize: "12.5px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#511F29",
              textDecoration: "none",
              borderBottom: "1px solid rgba(81,31,41,0.35)",
              paddingBottom: "5px",
              transition: "opacity 0.25s",
            }}
          >
            Voir le profil
          </Link>
        </div>

        {/* Grid - 6 columns responsive */}
        <div className="grid-cols-6-responsive">
          {posts.map((post) => (
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
                borderRadius: "2px",
              }}
            >
              <Image
                src={post.image}
                alt="SO'MAYA sur Instagram"
                fill
                className="transition-transform duration-700 group-hover:scale-[1.08]"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              {/* Hover Overlay - Peach */}
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
