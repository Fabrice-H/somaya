import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Layers, X } from "lucide-react";
import { ADMIN_LOTS_PATH, LOTS_TABLE_GRID } from "@/features/lots/constants";
import { formatLotPrice } from "@/features/lots/utils";
import { LotVisibilityToggle } from "./LotVisibilityToggle";
import type { PriceLot } from "@/features/lots/types";

type LotRowProps = {
  lot: PriceLot;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

export function LotRow({ lot, selected, loading, onSelect, onToggle, onDelete }: LotRowProps) {
  const cover = lot.items[0]?.image;
  const inStock = lot.total_stock > 0;

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "grid grid-cols-1 gap-4 px-5 py-4 border-b border-[#e8ddd4] items-center cursor-pointer transition-colors hover:bg-[#fafafa]",
        LOTS_TABLE_GRID,
        loading && "opacity-50 pointer-events-none",
        selected && "border-l-4 border-l-[#511f29] bg-[#fafafa]"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#fafafa] flex-shrink-0">
          {cover ? (
            <Image src={cover} alt={lot.name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#d4c4b0]">
              <Layers size={20} />
            </div>
          )}
        </div>
        <div>
          <Link
            href={`${ADMIN_LOTS_PATH}/${lot.id}`}
            onClick={stopPropagation}
            className="font-semibold text-[#000000] hover:text-[#3c161e] transition-colors"
          >
            {lot.name}
          </Link>
          {lot.category && <p className="text-[13px] text-[#6b6b6b]">{lot.category.name}</p>}
        </div>
      </div>

      <div className="text-[#000000] font-medium">
        <span className="md:hidden text-[#6b6b6b] text-sm mr-2">Prix:</span>
        {formatLotPrice(lot.price)}
      </div>

      <div className="text-[#6b6b6b]">
        <span className="md:hidden text-[#6b6b6b] text-sm mr-2">Articles:</span>
        {lot.total_items} art.
      </div>

      <div className="flex items-center gap-2">
        <span className="md:hidden text-[#6b6b6b] text-sm mr-2">Stock:</span>
        <span className={clsx("w-2 h-2 rounded-full", inStock ? "bg-emerald-500" : "bg-red-400")} />
        <span className={inStock ? "text-emerald-600" : "text-red-500"}>{lot.total_stock} u.</span>
      </div>

      <div onClick={stopPropagation}>
        <LotVisibilityToggle active={lot.is_active} onToggle={onToggle} />
      </div>

      <div onClick={stopPropagation}>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-[#c4b0a5] hover:text-red-500 transition-colors"
          title="Supprimer"
          aria-label={`Supprimer ${lot.name}`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
