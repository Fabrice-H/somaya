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
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <ol className="flex items-center gap-2 text-[13px] text-[#94786b] whitespace-nowrap py-1">
          <li>
            <Link
              href="/"
              className="inline-flex items-center text-[#94786b] hover:text-[#511F29] transition-colors"
              aria-label="Accueil"
            >
              <Home size={14} />
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight size={14} className="opacity-50" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-[#94786b] hover:text-[#511F29] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#2a181d]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
