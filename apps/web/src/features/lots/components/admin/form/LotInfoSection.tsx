import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import { parseNumberInput } from "@/features/lots/utils";
import type { CategoryOption } from "@/features/categories/types";

type LotInfoSectionProps = {
  name: string;
  price: number;
  categoryId: string;
  categories: CategoryOption[];
  onNameChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
};

export function LotInfoSection({
  name,
  price,
  categoryId,
  categories,
  onNameChange,
  onPriceChange,
  onCategoryChange,
}: LotInfoSectionProps) {
  return (
    <AdminCard title="Informations du lot">
      <div className="grid gap-6 md:grid-cols-3">
        <Field id="lot-name" label="Nom du lot" required>
          <input
            id="lot-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex : Chaînes 10k"
            className="input-som"
          />
        </Field>
        <Field id="lot-price" label="Prix (FCFA)" required>
          <input
            id="lot-price"
            type="number"
            value={price || ""}
            onChange={(e) => onPriceChange(parseNumberInput(e.target.value))}
            placeholder="10000"
            min="0"
            className="input-som tabular-nums"
          />
        </Field>
        <Field id="lot-category" label="Catégorie">
          <select
            id="lot-category"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-som cursor-pointer"
          >
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </AdminCard>
  );
}
