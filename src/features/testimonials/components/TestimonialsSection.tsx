import Image from "next/image";
import type { TestimonialCard } from "@/features/testimonials/types";

interface TestimonialsSectionProps {
  testimonials: TestimonialCard[];
}

// ============================================================
// Server Component - TestimonialsSection
// Design: Centered header, cream cards with border (matching old design)
// ============================================================

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section
      className="section-padding"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header - Centered */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6b6b6b",
            marginBottom: "14px",
          }}
        >
          Elles nous font confiance
        </div>
        <h2
          style={{
            fontFamily: "var(--font-stack)",
            fontWeight: 500,
            fontSize: "clamp(32px, 3.8vw, 52px)",
            lineHeight: 1,
            margin: 0,
            color: "#000000",
          }}
        >
          Témoignages
        </h2>
      </div>

      {/* Grid - 3 columns */}
      <div className="grid-cols-3-responsive">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            style={{
              background: "#fafafa",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "4px",
              padding: "38px 34px",
            }}
          >
            {/* Stars - Text */}
            <div
              style={{
                color: "#000000",
                letterSpacing: "0.18em",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
            </div>

            {/* Quote */}
            <p
              style={{
                fontFamily: "var(--font-stack)",
                fontStyle: "italic",
                fontSize: "19px",
                lineHeight: 1.6,
                color: "#000000",
                margin: "0 0 28px",
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
                  width={46}
                  height={46}
                  style={{
                    borderRadius: "999px",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "999px",
                    background: "#511f29",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#ffffff",
                  }}
                >
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#000000" }}>
                  {testimonial.name}
                </div>
                {testimonial.location && (
                  <div style={{ fontSize: "12px", color: "#6b6b6b", marginTop: "3px" }}>
                    {testimonial.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
