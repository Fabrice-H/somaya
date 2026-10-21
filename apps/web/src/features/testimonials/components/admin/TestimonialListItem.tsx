import Image from "next/image";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { MAX_RATING } from "@/features/testimonials/constants";
import type { TestimonialData } from "@/features/testimonials/types";

type TestimonialListItemProps = {
  item: TestimonialData;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const ICON_BUTTON =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:bg-[var(--som-surface-alt)]";

export function TestimonialListItem({ item, onToggleActive, onEdit, onDelete }: TestimonialListItemProps) {
  return (
    <article className="flex flex-col border border-[var(--som-border)] bg-white">
      <div className={`flex-1 p-5 ${item.isActive ? "" : "opacity-60"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[14px] font-medium text-[var(--som-primary)]">
                {item.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <p className="m-0 truncate text-[14px] font-medium text-[var(--som-ink)]">{item.name}</p>
              <p className="m-0 mt-0.5 truncate text-[12px] font-light text-[var(--som-gray)]">{item.location}</p>
            </div>
          </div>
          <Badge tone={item.isActive ? "success" : "neutral"}>{item.isActive ? "En ligne" : "Masqué"}</Badge>
        </div>

        <p
          className="m-0 mt-4 text-[13px] tracking-[0.2em] text-[var(--som-primary)]"
          aria-label={`${item.rating}/${MAX_RATING}`}
        >
          {"★".repeat(item.rating)}
          <span className="text-[var(--som-border-strong)]">{"★".repeat(Math.max(0, MAX_RATING - item.rating))}</span>
        </p>
        <p className="m-0 mt-3 line-clamp-4 text-[14px] font-light leading-relaxed text-[var(--som-ink)]">
          « {item.text} »
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--som-border)] py-1 pl-3 pr-1">
        <button
          type="button"
          onClick={onToggleActive}
          aria-pressed={item.isActive}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 px-2 text-[11px] uppercase tracking-[0.14em] text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
        >
          {item.isActive ? (
            <EyeOff size={15} strokeWidth={1.5} aria-hidden />
          ) : (
            <Eye size={15} strokeWidth={1.5} aria-hidden />
          )}
          {item.isActive ? "Masquer" : "Publier"}
        </button>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onEdit} className="btn-secondary btn-sm cursor-pointer whitespace-nowrap">
            <Pencil size={14} strokeWidth={1.5} aria-hidden />
            Modifier
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer"
            title="Supprimer"
            className={`${ICON_BUTTON} hover:text-[var(--som-error)]`}
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
