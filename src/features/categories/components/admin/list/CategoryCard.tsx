import Link from "next/link";
import Image from "next/image";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";
import type { Category } from "@/features/categories/types";

type CategoryCardProps = {
  category: Category;
  onDelete: (category: Category) => void;
};

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  return (
    <div className="group relative bg-[#fafafa]">
      <Link href={`${ADMIN_CATEGORIES_PATH}/${category.id}`} className="block relative aspect-square overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f2]">
            <FolderOpen size={32} className="text-[#6b6b6b]" />
          </div>
        )}

        <div className="absolute top-2 left-2">
          <span
            className="tabular-nums px-2 py-1 text-[10px] font-semibold"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
          >
            #{category.position}
          </span>
        </div>

        {!category.is_active && (
          <div className="absolute top-2 right-2">
            <span
              className="px-2 py-1 text-[10px] font-semibold uppercase"
              style={{ background: "#ef4444", color: "white" }}
            >
              Inactive
            </span>
          </div>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(81,31,41,0.5)" }}
        >
          <span className="px-4 py-2.5 bg-white text-[#000000] text-xs font-semibold tracking-wide">
            <Pencil size={14} className="inline mr-2" style={{ verticalAlign: "middle" }} />
            Modifier
          </span>
        </div>
      </Link>

      <div style={{ padding: "12px 14px 14px" }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[#000000] mb-0.5 truncate">{category.name}</h3>
            <p className="text-xs text-[#6b6b6b] truncate">/{category.slug}</p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(category)}
            aria-label={`Supprimer ${category.name}`}
            className="w-7 h-7 inline-flex items-center justify-center text-[#6b6b6b] hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
