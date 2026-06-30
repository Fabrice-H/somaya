"use client";

import Image from "next/image";
import { testimonials } from "@/data/products";

export function TestimonialsSection() {
  return (
    <section
      className="section-padding"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#94786b",
            marginBottom: "14px",
          }}
        >
          Elles nous font confiance
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(32px, 3.8vw, 52px)",
            lineHeight: 1,
            margin: 0,
            color: "#2a181d",
          }}
        >
          Témoignages
        </h2>
      </div>

      {/* Grid */}
      <div className="grid-cols-3-responsive">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            style={{
              background: "#faf6f1",
              border: "1px solid rgba(81,31,41,0.1)",
              borderRadius: "4px",
              padding: "38px 34px",
            }}
          >
            {/* Stars */}
            <div
              style={{
                color: "#511F29",
                letterSpacing: "0.18em",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              ★★★★★
            </div>

            {/* Quote */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "19px",
                lineHeight: 1.6,
                color: "#2a181d",
                margin: "0 0 28px",
              }}
            >
              &ldquo;{testimonial.text}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={46}
                height={46}
                style={{
                  borderRadius: "999px",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  border: "1px solid rgba(81,31,41,0.12)",
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#2a181d" }}>
                  {testimonial.name}
                </div>
                <div style={{ fontSize: "12px", color: "#94786b", marginTop: "3px" }}>
                  {testimonial.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
