"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Builds "Sur cette page" from the h2 of the legal content and highlights the section in view
export function LegalToc({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const headings = Array.from(container.querySelectorAll("h2"));
    const found = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent ?? "");
      return { id: h.id, label: h.textContent ?? "" };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings only exist in the DOM after render
    setItems(found);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [containerId]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Sur cette page">
      <p className="m-0 mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">Sur cette page</p>
      <ol className="m-0 flex list-none flex-col gap-1 border-l border-[var(--som-border)] p-0">
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px flex gap-3 border-l py-1.5 pl-4 text-[13px] leading-snug transition-colors ${
                  active
                    ? "border-[var(--som-primary)] text-[var(--som-ink)]"
                    : "border-transparent font-light text-[#666] hover:text-[var(--som-ink)]"
                }`}
              >
                <span className="text-[11px] text-[var(--som-primary)] tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
