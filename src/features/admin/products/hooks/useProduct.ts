"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { getProduct } from "../actions";
import type { Product } from "../types";

export function useProduct(id: string | undefined) {
  return useQuery<Product | null>({
    queryKey: queryKeys.products.detail(id ?? ""),
    queryFn: () => (id ? getProduct(id) : null),
    enabled: !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
