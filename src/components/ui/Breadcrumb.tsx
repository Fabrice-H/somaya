"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://somaya.ci",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        ...(item.href && { item: `https://somaya.ci${item.href}` }),
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visible Breadcrumb */}
      <nav aria-label="Fil d'Ariane" style={{ marginBottom: "24px" }}>
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: "13px",
            color: "#94786b",
          }}
        >
          <li>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "#94786b",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              aria-label="Accueil"
            >
              <Home size={14} />
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
              {item.href ? (
                <Link
                  href={item.href}
                  style={{
                    color: "#94786b",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "#2a181d" }}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
