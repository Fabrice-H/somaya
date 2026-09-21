import { Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVisiblePages } from "../../../utils";

interface OrdersPaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

const ARROW_CLASS =
  "w-10 h-10 flex items-center justify-center border border-[#511f29]/20 hover:bg-[#fafafa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

export function OrdersPagination({ page, totalPages, disabled, onPageChange }: OrdersPaginationProps) {
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        aria-label="Page précédente"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || disabled}
        className={ARROW_CLASS}
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, index) => {
        const isCurrent = p === page;
        return (
          <Fragment key={p}>
            {index > 0 && p - pages[index - 1] > 1 && <span className="text-[#6b6b6b]">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled}
              aria-current={isCurrent ? "page" : undefined}
              className="w-10 h-10 flex items-center justify-center border transition-colors"
              style={{
                background: isCurrent ? "#511f29" : "transparent",
                color: isCurrent ? "#f1e1e5" : "#000000",
                borderColor: isCurrent ? "#511f29" : "rgba(81,31,41,0.2)",
              }}
            >
              {p}
            </button>
          </Fragment>
        );
      })}
      <button
        type="button"
        aria-label="Page suivante"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || disabled}
        className={ARROW_CLASS}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
