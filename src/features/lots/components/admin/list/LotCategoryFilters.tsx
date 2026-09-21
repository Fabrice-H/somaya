import clsx from "clsx";
import type { CategoryOption } from "@/features/categories/types";

type LotCategoryFiltersProps = {
  categories: CategoryOption[];
  active: string | null;
  onChange: (id: string | null) => void;
};

function chipClass(selected: boolean) {
  return clsx(
    "px-4 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all whitespace-nowrap",
    selected ? "bg-[#511f29] text-white" : "bg-white text-[#000000] border border-[#e8ddd4] hover:bg-[#fafafa]"
  );
}

export function LotCategoryFilters({ categories, active, onChange }: LotCategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      <button type="button" onClick={() => onChange(null)} className={chipClass(!active)}>
        TOUT
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={chipClass(active === category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
