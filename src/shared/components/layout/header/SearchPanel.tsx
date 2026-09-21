import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/catalogue?q=${encodeURIComponent(value)}`);
    setQuery("");
    onClose();
  };

  return (
    <div
      id="search-panel"
      inert={!open}
      className={`absolute inset-x-0 top-full border-b border-t border-[#ececec] bg-white transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className="py-4">
        <form role="search" onSubmit={submit} className="container-som flex items-center gap-3">
          <Search size={18} strokeWidth={1.4} aria-hidden className="shrink-0 text-[var(--som-gray)]" />
          <label htmlFor="header-search" className="sr-only">
            Rechercher un produit
          </label>
          <input
            ref={inputRef}
            id="header-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit, une catégorie…"
            autoComplete="off"
            className="h-11 flex-1 bg-transparent text-[16px] font-light text-[var(--som-ink)] outline-none placeholder:text-[#9a9a9a] md:text-[17px]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </form>
      </div>
    </div>
  );
}
