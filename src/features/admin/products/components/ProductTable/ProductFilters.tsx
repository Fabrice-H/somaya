"use client";

import { memo } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const ProductFilters = memo(function ProductFilters({
  search,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#511F29]/40"
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#511F29]/20
                   focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                   text-[#511F29] placeholder:text-[#511F29]/40"
        />
      </div>
      <Link
        href="/admin/produits/nouveau"
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#511F29] text-white
                 hover:bg-[#511F29]/90 transition-colors text-sm font-medium"
      >
        <Plus size={18} />
        Nouveau produit
      </Link>
    </div>
  );
});
