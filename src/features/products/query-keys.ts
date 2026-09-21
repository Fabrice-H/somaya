// Query Key Factory for type-safe and consistent query keys
// Following TanStack Query best practices

export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: { category?: string; search?: string; page?: number }) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    featured: () => [...queryKeys.products.all, "featured"] as const,
    bestsellers: () => [...queryKeys.products.all, "bestsellers"] as const,
    new: () => [...queryKeys.products.all, "new"] as const,
    byCategory: (categorySlug: string) =>
      [...queryKeys.products.all, "category", categorySlug] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: { active?: boolean }) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    bySlug: (slug: string) =>
      [...queryKeys.categories.all, "slug", slug] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters?: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    byNumber: (orderNumber: string) =>
      [...queryKeys.orders.all, "number", orderNumber] as const,
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    revenue: (period?: "day" | "week" | "month" | "year") =>
      [...queryKeys.dashboard.all, "revenue", period] as const,
    recentOrders: () => [...queryKeys.dashboard.all, "recent-orders"] as const,
    topProducts: () => [...queryKeys.dashboard.all, "top-products"] as const,
  },

  // Store Settings
  settings: {
    all: ["settings"] as const,
    store: () => [...queryKeys.settings.all, "store"] as const,
    deliveryZones: () => [...queryKeys.settings.all, "delivery-zones"] as const,
  },

  // Search (for global search functionality)
  search: {
    all: ["search"] as const,
    products: (query: string) =>
      [...queryKeys.search.all, "products", query] as const,
    global: (query: string) =>
      [...queryKeys.search.all, "global", query] as const,
  },
} as const;

// Helper type to infer query key types
export type QueryKeys = typeof queryKeys;
