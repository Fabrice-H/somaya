"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_PRODUCTS_PATH } from "../constants";

export function useProductListParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (params: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!("page" in params)) next.delete("page");
    next.delete("saved");
    startTransition(() => {
      router.push(`${ADMIN_PRODUCTS_PATH}?${next.toString()}`, { scroll: false });
    });
  };

  return {
    page: Number(searchParams.get("page")) || 1,
    query: searchParams.get("q") ?? "",
    categoryId: searchParams.get("category") ?? "",
    stock: searchParams.get("stock") ?? "",
    saved: searchParams.get("saved"),
    isPending,
    update,
  };
}
