import { X } from "lucide-react";
import { DateFilterInput } from "./DateFilterInput";
import { OrderSearchInput } from "./OrderSearchInput";

interface OrderFiltersBarProps {
  search: string;
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
  isPending: boolean;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearAll: () => void;
}

export function OrderFiltersBar({
  search,
  dateFrom,
  dateTo,
  hasActiveFilters,
  isPending,
  onSearchChange,
  onSearchClear,
  onDateFromChange,
  onDateToChange,
  onClearAll,
}: OrderFiltersBarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-3"
      style={{ padding: "16px 20px", background: "#fafafa", border: "1px solid rgba(81,31,41,0.1)" }}
    >
      <OrderSearchInput value={search} onChange={onSearchChange} onClear={onSearchClear} />
      <DateFilterInput label="Date de début" value={dateFrom} onChange={onDateFromChange} />
      <DateFilterInput label="Date de fin" value={dateTo} onChange={onDateToChange} />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          disabled={isPending}
          className="inline-flex items-center gap-2 transition-colors hover:bg-white"
          style={{
            height: 44,
            padding: "0 16px",
            border: "1px solid rgba(81,31,41,0.15)",
            background: "transparent",
            fontSize: 13,
            color: "#6b6b6b",
            cursor: isPending ? "wait" : "pointer",
          }}
        >
          <X size={14} />
          Effacer
        </button>
      )}
    </div>
  );
}
