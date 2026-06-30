"use client";

import { whyChooseReasons } from "@/data/products";

export default function WhyChooseSection() {
  return (
    <section style={{ background: "#f1e8df" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(80px, 9vw, 120px) clamp(20px, 4vw, 40px)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "14px",
            }}
          >
            L&apos;engagement SO&apos;MAYA
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 52px)",
              lineHeight: 1.05,
              margin: 0,
              color: "#2a181d",
            }}
          >
            Pourquoi nous choisir
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid-cols-5-responsive"
          style={{
            borderTop: "1px solid rgba(81,31,41,0.16)",
          }}
        >
          {whyChooseReasons.map((reason, index) => (
            <div
              key={reason.num}
              style={{
                padding: "40px 22px 0",
                borderRight: index < whyChooseReasons.length - 1 ? "1px solid rgba(81,31,41,0.12)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "34px",
                  color: "#511F29",
                  marginBottom: "22px",
                  lineHeight: 1,
                }}
              >
                {reason.num}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  margin: "0 0 12px",
                  color: "#2a181d",
                  lineHeight: 1.2,
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.7,
                  color: "#6e5a50",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
