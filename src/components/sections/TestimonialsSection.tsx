import Image from "next/image";
import { Star } from "lucide-react";
import type { HomeTestimonial } from "@/lib/queries/home";

interface TestimonialsSectionProps {
  testimonials: HomeTestimonial[];
}

// ============================================================
// Server Component - TestimonialsSection
// Style Telo - Clean, Modern, Rounded cards
// ============================================================

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section
      style={{
        background: "#faf6f1",
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
            textAlign: "center",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
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
            Avis clients
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
            Ce qu&apos;ils en pensent
          </h2>
        </div>

        {/* Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="animate-fade-in-up"
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "clamp(24px, 3vw, 36px)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "20px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < testimonial.rating ? "#fcd3b4" : "transparent"}
                    stroke={i < testimonial.rating ? "#fcd3b4" : "#d4c4b0"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontStyle: "italic",
                  fontSize: "clamp(16px, 1.8vw, 20px)",
                  lineHeight: 1.6,
                  color: "#2a181d",
                  margin: "0 0 24px",
                }}
              >
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center 20%",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#fbf3ec",
                    }}
                  >
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#2a181d",
                    }}
                  >
                    {testimonial.name}
                  </div>
                  {testimonial.location && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "2px",
                      }}
                    >
                      {testimonial.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
