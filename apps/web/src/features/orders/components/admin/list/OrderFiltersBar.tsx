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
    <div className="flex flex-col gap-3 border-b border-[var(--som-border)] p-5 md:flex-row md:flex-wrap md:items-center lg:px-6">
      <OrderSearchInput value={search} onChange={onSearchChange} onClear={onSearchClear} />
      <div className="grid grid-cols-2 gap-3 md:flex">
        <DateFilterInput label="Date de début" value={dateFrom} onChange={onDateFromChange} />
        <DateFilterInput label="Date de fin" value={dateTo} onChange={onDateToChange} />
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          disabled={isPending}
          className={`btn-link self-start md:ml-auto md:self-center ${isPending ? "cursor-wait" : ""}`}
        >
          <X size={15} strokeWidth={1.5} aria-hidden />
          Réinitialiser
        </button>
      )}
    </div>
  );
}
