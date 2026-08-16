import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeInstagramData } from "@/lib/queries/home";

// Instagram Icon Component
function InstagramIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
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
// Style Telo - Clean, Modern, Rounded
// ============================================================

export function InstagramSection({ data }: InstagramSectionProps) {
  const { posts, username, profileUrl } = data;

  if (posts.length === 0) return null;

  return (
    <section
      style={{
        background: "#ffffff",
        padding: "clamp(40px, 5vw, 60px) 0",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
        }}
      >
        {/* Header */}
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(32px, 5vw, 48px)",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#94786b",
                marginBottom: "10px",
                fontWeight: 500,
              }}
            >
              Suivez-nous
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                margin: 0,
                color: "#2a181d",
                letterSpacing: "-0.02em",
              }}
            >
              @{username}
            </h2>
          </div>
          <Link
            href={profileUrl}
            target="_blank"
            className="group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              padding: "12px 24px",
              background: "#511F29",
              color: "#fbf3ec",
              borderRadius: "6px",
              transition: "all 0.3s ease",
            }}
          >
            <InstagramIcon size={16} />
            Voir le profil
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="instagram-grid">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={post.postUrl || profileUrl}
              target="_blank"
              className="group animate-fade-in-up"
              style={{
                position: "relative",
                display: "block",
                aspectRatio: "1/1",
                overflow: "hidden",
                background: "#ece0d3",
                borderRadius: "12px",
                animationDelay: `${index * 50}ms`,
              }}
            >
              <Image
                src={post.image}
                alt="SO'MAYA sur Instagram"
                fill
                className="transition-transform duration-500 group-hover:scale-110"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
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
                  background: "rgba(81, 31, 41, 0.7)",
                }}
              >
                <InstagramIcon size={28} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
