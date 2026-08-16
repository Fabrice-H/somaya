"use client";

import { useState, useCallback, useMemo } from "react";
import { ProductFilters } from "./ProductFilters";
import { ProductRow } from "./ProductRow";
import { useProductMutations } from "../../hooks";
import type { Product } from "../../types";

interface ProductTableProps {
  initialProducts: Product[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { toggleActiveMutation, deleteMutation } = useProductMutations();

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return initialProducts;

    const searchLower = search.toLowerCase();
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category?.name?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower)
    );
  }, [initialProducts, search]);

  const handleToggle = useCallback(
    async (id: string, isActive: boolean) => {
      setLoadingId(id);
      try {
        await toggleActiveMutation.mutateAsync({ id, isActive: !isActive });
      } finally {
        setLoadingId(null);
      }
    },
    [toggleActiveMutation]
  );

  const handleDelete = useCallback(
    async (id: string, _name: string) => {
      setLoadingId(id);
      try {
        await deleteMutation.mutateAsync(id);
      } finally {
        setLoadingId(null);
      }
    },
    [deleteMutation]
  );

  return (
    <div>
      <ProductFilters search={search} onSearchChange={setSearch} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf6f1]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#511F29]/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#511F29]/10">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isLoading={loadingId === product.id}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-[#511F29]/50">
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
