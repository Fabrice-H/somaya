"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div style={{ background: "var(--som-cream)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div className="container-som" style={{ paddingTop: "clamp(30px, 4vw, 50px)" }}>
        <Breadcrumb items={[{ label: title }]} />
      </div>

      {/* Header */}
      <section
        style={{
          padding: "clamp(40px, 5vw, 60px) clamp(20px, 4vw, 48px)",
          background: "var(--som-burgundy)",
          marginTop: "20px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 400,
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(252, 211, 180, 0.7)",
              margin: 0,
            }}
          >
            Dernière mise à jour : {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 48px)",
          background: "#fff",
        }}
      >
        <div
          className="legal-content"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .legal-content h2 {
          font-family: var(--font-serif);
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 500;
          color: var(--som-text);
          margin: 48px 0 20px;
        }
        .legal-content h2:first-child {
          margin-top: 0;
        }
        .legal-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--som-text);
          margin: 32px 0 12px;
        }
        .legal-content p {
          font-size: 15px;
          line-height: 1.8;
          color: var(--som-text-light);
          margin: 0 0 16px;
        }
        .legal-content ul {
          margin: 0 0 16px;
          padding-left: 24px;
        }
        .legal-content li {
          font-size: 15px;
          line-height: 1.8;
          color: var(--som-text-light);
          margin-bottom: 8px;
        }
        .legal-content a {
          color: var(--som-burgundy);
          text-decoration: underline;
        }
        .legal-content strong {
          color: var(--som-text);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
