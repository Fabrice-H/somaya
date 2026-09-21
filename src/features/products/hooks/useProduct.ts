"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/products/query-keys";
import { getProduct } from "@/features/products/server/actions";
import type { Product } from "@/features/products/types";

export function useProduct(id: string | undefined) {
  return useQuery<Product | null>({
    queryKey: queryKeys.products.detail(id ?? ""),
    queryFn: () => (id ? getProduct(id) : null),
    enabled: !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
