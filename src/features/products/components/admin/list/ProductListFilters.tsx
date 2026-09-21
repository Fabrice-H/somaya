"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { STOCK_FILTER_OPTIONS } from "@/features/products/constants";
import type { AdminProductFilters, CategoryOption } from "@/features/products/types";

const SELECT_CLASS = "h-11 px-4 bg-[#fafafa] border border-black text-[#000000] text-sm outline-none cursor-pointer";

interface ProductListFiltersProps {
  filters: AdminProductFilters;
  categories: CategoryOption[];
  onChange: (params: Record<string, string | null>) => void;
}

export function ProductListFilters({ filters, categories, onChange }: ProductListFiltersProps) {
  const [search, setSearch] = useState(filters.query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onChange({ q: search || null });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <form onSubmit={handleSubmit} className="flex-1 min-w-[200px] max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full h-11 pl-10 pr-4 bg-[#fafafa] border border-black text-[#000000] text-sm outline-none transition-colors focus:border-black"
          />
        </div>
      </form>

      <select
        value={filters.categoryId}
        onChange={(e) => onChange({ category: e.target.value || null })}
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
        className={SELECT_CLASS}
      >
        <option value="">Tous les stocks</option>
        {STOCK_FILTER_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
