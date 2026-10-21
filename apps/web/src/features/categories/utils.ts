import { EMPTY_RICH_TEXT } from "./constants";
import type { Category, CategoryInput } from "./types";

export function toCategoryFormValues(category?: Category): CategoryInput {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image_url: category?.image_url ?? null,
    position: category?.position ?? 0,
    is_active: category?.is_active ?? true,
  };
}

export function normalizeRichText(value: string): string | null {
  return value && value !== EMPTY_RICH_TEXT ? value : null;
}

export function parsePositionInput(value: string): number {
  return value === "" ? 0 : parseInt(value, 10) || 0;
}

export function getCategoryStats(categories: Category[]) {
  return {
    total: categories.length,
    withImage: categories.filter((category) => category.image_url).length,
    active: categories.filter((category) => category.is_active).length,
  };
}
