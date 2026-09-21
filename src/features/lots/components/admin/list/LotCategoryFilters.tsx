import { Tabs } from "@/shared/components/admin/ui/Tabs";
import type { CategoryOption } from "@/features/categories/types";

type LotCategoryFiltersProps = {
  categories: CategoryOption[];
  active: string | null;
  onChange: (id: string | null) => void;
};

const ALL = "__all__";

export function LotCategoryFilters({ categories, active, onChange }: LotCategoryFiltersProps) {
  const items = [{ value: ALL, label: "Tout" }, ...categories.map((c) => ({ value: c.id, label: c.name }))];

  return (
    <div className="px-5 lg:px-6">
      <Tabs
        label="Filtrer par catégorie"
        items={items}
        value={active ?? ALL}
        onChange={(value) => onChange(value === ALL ? null : value)}
      />
    </div>
  );
}
