"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CUSTOMER_FILTER_KEYS, CUSTOMERS_PATH } from "../constants";

const SEARCH_DEBOUNCE_MS = 300;

type FilterUpdates = Partial<Record<(typeof CUSTOMER_FILTER_KEYS)[number] | "page", string | null>>;

export function useCustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const segment = searchParams.get("segment") ?? "all";
  const sort = searchParams.get("sort") ?? "recent";
  const hasActiveFilters = CUSTOMER_FILTER_KEYS.some((key) => searchParams.has(key));

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const navigate = useCallback((url: string) => startTransition(() => router.push(url, { scroll: false })), [router]);

  const updateFilters = useCallback(
    (updates: FilterUpdates) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || (key === "sort" && value === "recent")) params.delete(key);
        else params.set(key, value);
      }
      if (!("page" in updates)) params.delete("page");
      const query = params.toString();
      navigate(query ? `${CUSTOMERS_PATH}?${query}` : CUSTOMERS_PATH);
    },
    [navigate, searchParams]
  );

  const setSearch = (value: string) => {
    setSearchValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateFilters({ search: value.trim() }), SEARCH_DEBOUNCE_MS);
  };

  const clearAll = () => {
    clearTimeout(debounceRef.current);
    setSearchValue("");
    navigate(CUSTOMERS_PATH);
  };

  return {
    segment,
    sort,
    search,
    hasActiveFilters,
    isPending,
    setSegment: (value: string) => updateFilters({ segment: value }),
    setSort: (value: string) => updateFilters({ sort: value }),
    setPage: (value: number) => updateFilters({ page: String(value) }),
    setSearch,
    clearAll,
  };
}
