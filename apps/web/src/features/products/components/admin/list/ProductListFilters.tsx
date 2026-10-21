"use client";

import { useState, type FormEvent } from "react";
import { SearchField } from "@/shared/components/admin/ui/SearchField";
import { STOCK_FILTER_OPTIONS } from "@/features/products/constants";
import type { AdminProductFilters, CategoryOption } from "@/features/products/types";

const SELECT_CLASS = "input-som cursor-pointer !min-h-11 !py-0 !text-[14px] sm:!w-[200px]";

interface ProductListFiltersProps {
  filters: AdminProductFilters;
  categories: CategoryOption[];
  resultLabel: string;
  onChange: (params: Record<string, string | null>) => void;
}

export function ProductListFilters({ filters, categories, resultLabel, onChange }: ProductListFiltersProps) {
  const [search, setSearch] = useState(filters.query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onChange({ q: search || null });
  };

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="sm:w-[360px] [&_.input-group-som]:!min-h-11 [&_label]:!max-w-none"
      >
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un produit…"
          label="Rechercher un produit"
        />
      </form>
      <select
        value={filters.categoryId}
        onChange={(e) => onChange({ category: e.target.value || null })}
        aria-label="Filtrer par catégorie"
        className={SELECT_CLASS}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={filters.stock}
        onChange={(e) => onChange({ stock: e.target.value || null })}
        aria-label="Filtrer par stock"
        className={SELECT_CLASS}
      >
        <option value="">Tous les stocks</option>
        {STOCK_FILTER_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <p className="m-0 text-[11px] uppercase tracking-[0.16em] tabular-nums text-[var(--som-gray)] sm:ml-auto">
        {resultLabel}
      </p>
    </div>
  );
}
