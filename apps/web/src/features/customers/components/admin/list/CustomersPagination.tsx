import { Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVisiblePages } from "@/shared/lib/utils";

interface CustomersPaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

const SQUARE = "btn-sm min-w-10! px-0! disabled:cursor-not-allowed disabled:opacity-40";

export function CustomersPagination({ page, totalPages, disabled, onPageChange }: CustomersPaginationProps) {
  const pages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--som-border)] px-5 py-4 lg:px-6"
    >
      <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
        Page <span className="tabular-nums">{page}</span> sur <span className="tabular-nums">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Page précédente"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || disabled}
          className={`btn-secondary ${SQUARE}`}
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
        </button>
        {pages.map((p, index) => (
          <Fragment key={p}>
            {index > 0 && p - pages[index - 1] > 1 && (
              <span aria-hidden className="px-1 text-[var(--som-gray)]">
                …
              </span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled}
              aria-current={p === page ? "page" : undefined}
              className={`${p === page ? "btn-primary" : "btn-secondary"} ${SQUARE} tabular-nums`}
            >
              {p}
            </button>
          </Fragment>
        ))}
        <button
          type="button"
          aria-label="Page suivante"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || disabled}
          className={`btn-secondary ${SQUARE}`}
        >
          <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
