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

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const href = `${ADMIN_CATEGORIES_PATH}/${category.id}`;

  return (
    <article className="flex flex-col border border-[var(--som-border)] bg-white transition-colors hover:border-[var(--som-border-strong)]">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--som-primary-50)]"
      >
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt=""
            fill
            className={`object-cover ${category.is_active ? "" : "opacity-50 grayscale"}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[var(--som-primary)]">
            <FolderOpen size={28} strokeWidth={1.2} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={href}
          className="line-clamp-2 text-[15px] font-medium leading-snug text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
        >
          {category.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <Badge tone={category.is_active ? "success" : "neutral"}>{category.is_active ? "En ligne" : "Masquée"}</Badge>
          <span className="text-[11px] tabular-nums text-[var(--som-gray)]">Ordre {category.position}</span>
        </div>
      </div>

      <div className="flex border-t border-[var(--som-border)]">
        <Link
          href={href}
          className="flex h-11 flex-1 items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)] transition-colors hover:bg-[var(--som-surface-alt)] hover:text-[var(--som-primary)]"
        >
          <Pencil size={14} strokeWidth={1.5} aria-hidden />
          Modifier
        </Link>
        <button
          type="button"
          onClick={() => onDelete(category)}
          aria-label={`Supprimer ${category.name}`}
          title="Supprimer"
          className="flex h-11 w-12 cursor-pointer items-center justify-center border-l border-[var(--som-border)] text-[var(--som-gray)] transition-colors hover:bg-[var(--som-error-tint)] hover:text-[var(--som-error)]"
        >
          <Trash2 size={15} strokeWidth={1.5} />
        </button>
      </div>
    </article>
  );
}
