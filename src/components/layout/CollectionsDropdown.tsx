"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { NavCategory } from "@/lib/queries/home";

interface CollectionsDropdownProps {
  categories: NavCategory[];
  onNavigate?: () => void;
}

export function CollectionsDropdown({ categories, onNavigate }: CollectionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (categories.length === 0) {
    return (
      <Link
        href="/catalogue"
        className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
      >
        Collections
      </Link>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        className="flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        Collections
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
          style={{ minWidth: "280px" }}
        >
          <div
            className="bg-white shadow-xl border border-[var(--som-burgundy)]/10 overflow-hidden"
            style={{
              borderRadius: "2px",
            }}
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-[var(--som-burgundy)]/10 bg-[var(--som-cream)]">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--som-burgundy)]/60">
                Nos Collections
              </p>
            </div>

            {/* Categories List */}
            <div className="py-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogue/${category.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--som-cream)] transition-colors group"
                >
                  {category.imageUrl ? (
                    <div className="w-10 h-10 relative overflow-hidden rounded-sm flex-shrink-0">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-[var(--som-burgundy)]/10 rounded-sm flex-shrink-0" />
                  )}
                  <span className="text-[13px] font-medium text-[var(--som-text)] group-hover:text-[var(--som-burgundy)] transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--som-burgundy)]/10 bg-[var(--som-cream)]">
              <Link
                href="/catalogue"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--som-burgundy)] hover:underline"
              >
                Voir toutes les collections →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile version - Expandable list
export function CollectionsMenuMobile({ categories, onNavigate }: CollectionsDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
      >
        Collections
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 ml-4 space-y-2 border-l-2 border-[var(--som-burgundy)]/20 pl-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogue/${category.slug}`}
              onClick={onNavigate}
              className="block text-[12px] font-medium text-[var(--som-text)]/80 hover:text-[var(--som-burgundy)] transition-colors py-1"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/catalogue"
            onClick={onNavigate}
            className="block text-[11px] font-semibold text-[var(--som-burgundy)] hover:underline pt-2"
          >
            Tout voir →
          </Link>
        </div>
      )}
    </div>
  );
}
