import type { Category as CategoryRow } from "@/shared/lib/db/schema";
import type { Category } from "../types";

export function toAdminCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.imageUrl,
    position: row.position,
    is_active: row.isActive,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}
