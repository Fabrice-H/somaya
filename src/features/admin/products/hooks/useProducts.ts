"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { getProducts } from "../actions";
import type { Product, ProductFilters } from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProducts(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useProductsWithFilters(
  products: Product[],
  filters?: ProductFilters
) {
  if (!filters) return products;

  return products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.name
        ?.toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !categoryMatch) return false;
    }

    // Category filter
    if (filters.categoryId && product.category_id !== filters.categoryId) {
      return false;
    }

    // Active filter
    if (filters.isActive !== undefined && product.is_active !== filters.isActive) {
      return false;
    }

    return true;
  });
}
