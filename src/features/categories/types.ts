import type { Category as CategoryRow } from "@/shared/lib/db/schema";

export type CategoryWithProductCount = CategoryRow & { productCount: number };
