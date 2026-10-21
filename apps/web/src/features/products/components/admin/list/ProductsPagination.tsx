import { ChevronLeft, ChevronRight } from "lucide-react";
import { visiblePages } from "@/features/products/utils";

const CELL_CLASS =
  "flex h-10 min-w-10 cursor-pointer items-center justify-center border px-2 text-[13px] tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--som-primary)]";
const IDLE_CLASS =
  "border-[var(--som-border)] bg-white text-[var(--som-ink)] hover:border-[var(--som-border-strong)] hover:bg-[var(--som-surface-alt)]";

interface ProductsPaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

export function ProductsPagination({ page, totalPages, disabled, onPageChange }: ProductsPaginationProps) {
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || disabled}
        aria-label="Page précédente"
        className={`${CELL_CLASS} ${IDLE_CLASS}`}
      >
        <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
      </button>

      {visiblePages(page, totalPages).map((current, index, pages) => (
        <span key={current} className="flex items-center gap-2">
          {index > 0 && current - pages[index - 1] > 1 && (
            <span aria-hidden className="px-1 text-[var(--som-gray)]">
              …
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(current)}
            disabled={disabled}
            aria-current={current === page ? "page" : undefined}
            className={`${CELL_CLASS} ${
              current === page ? "border-[var(--som-primary)] bg-[var(--som-primary)] text-white" : IDLE_CLASS
            }`}
          >
            {current}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || disabled}
        aria-label="Page suivante"
        className={`${CELL_CLASS} ${IDLE_CLASS}`}
      >
        <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
      </button>
    </nav>
  );
}
