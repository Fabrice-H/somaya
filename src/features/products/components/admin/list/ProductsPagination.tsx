import { ChevronLeft, ChevronRight } from "lucide-react";
import { visiblePages } from "@/features/products/utils";

const ARROW_CLASS =
  "w-10 h-10 flex items-center justify-center border border-[#511f29]/20 hover:bg-[#fafafa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

interface ProductsPaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

export function ProductsPagination({ page, totalPages, disabled, onPageChange }: ProductsPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || disabled}
        aria-label="Page précédente"
        className={ARROW_CLASS}
      >
        <ChevronLeft size={18} />
      </button>

      {visiblePages(page, totalPages).map((current, index, pages) => (
        <span key={current} className="flex items-center gap-2">
          {index > 0 && current - pages[index - 1] > 1 && <span className="text-[#6b6b6b]">...</span>}
          <button
            type="button"
            onClick={() => onPageChange(current)}
            disabled={disabled}
            className={`w-10 h-10 flex items-center justify-center border transition-colors ${
              current === page ? "bg-[#511f29] text-white border-[#511f29]" : "border-[#511f29]/20 hover:bg-[#fafafa]"
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
        className={ARROW_CLASS}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
