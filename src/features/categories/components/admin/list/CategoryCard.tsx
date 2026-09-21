import Link from "next/link";
import Image from "next/image";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";
import type { Category } from "@/features/categories/types";

type CategoryCardProps = {
  category: Category;
  onDelete: (category: Category) => void;
};

const ICON_BUTTON =
  "inline-flex h-10 w-10 items-center justify-center text-[var(--som-gray)] transition-colors hover:bg-[var(--som-surface-alt)]";

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const href = `${ADMIN_CATEGORIES_PATH}/${category.id}`;

  return (
    <article className="group flex flex-col border border-[var(--som-border)] bg-white">
      <Link
        href={href}
        aria-label={`Modifier ${category.name}`}
        className="relative block aspect-square overflow-hidden bg-[var(--som-primary-50)]"
      >
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
              category.is_active ? "" : "opacity-60"
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[var(--som-primary)]">
            <FolderOpen size={28} strokeWidth={1.2} aria-hidden />
          </span>
        )}
        <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] uppercase tabular-nums tracking-[0.14em] text-[var(--som-ink)]">
          N° {category.position}
        </span>
      </Link>

      <div className="flex flex-1 items-start justify-between gap-2 border-t border-[var(--som-border)] py-3 pl-4 pr-1">
        <div className="min-w-0 pt-1">
          <Link
            href={href}
            className="block truncate text-[14px] font-medium text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
          >
            {category.name}
          </Link>
          <p className="m-0 mt-0.5 truncate text-[12px] font-light text-[var(--som-gray)]">/{category.slug}</p>
          <div className="mt-3">
            <Badge tone={category.is_active ? "success" : "neutral"}>
              {category.is_active ? "En ligne" : "Masquée"}
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 flex-col">
          <Link
            href={href}
            aria-label={`Modifier ${category.name}`}
            className={`${ICON_BUTTON} hover:text-[var(--som-ink)]`}
          >
            <Pencil size={15} strokeWidth={1.5} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(category)}
            aria-label={`Supprimer ${category.name}`}
            className={`${ICON_BUTTON} cursor-pointer hover:text-[var(--som-error)]`}
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
