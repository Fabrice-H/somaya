import { parseNumberInput } from "@/features/lots/utils";
import type { CategoryOption } from "@/features/categories/types";

const INPUT_CLASS =
  "w-full h-11 px-4 border border-black focus:outline-none focus:ring-2 focus:ring-black/10 text-[#000000]";

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
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-lg font-medium text-[#3c161e] mb-4">Informations du lot</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="lot-name" className="block text-sm text-[#6b6b6b] mb-1.5">
            Nom du lot *
          </label>
          <input
            id="lot-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex: Chaînes 10k"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="lot-price" className="block text-sm text-[#6b6b6b] mb-1.5">
            Prix (FCFA) *
          </label>
          <input
            id="lot-price"
            type="number"
            value={price || ""}
            onChange={(e) => onPriceChange(parseNumberInput(e.target.value))}
            placeholder="10000"
            min="0"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="lot-category" className="block text-sm text-[#6b6b6b] mb-1.5">
            Catégorie
          </label>
          <select
            id="lot-category"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`${INPUT_CLASS} bg-white`}
          >
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
