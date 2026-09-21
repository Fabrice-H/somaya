import Image from "next/image";
import clsx from "clsx";
import { Edit2, GripVertical, Trash2 } from "lucide-react";
import { MAX_RATING } from "@/features/testimonials/constants";
import type { TestimonialData } from "@/features/testimonials/types";

type TestimonialListItemProps = {
  item: TestimonialData;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TestimonialListItem({ item, onToggleActive, onEdit, onDelete }: TestimonialListItemProps) {
  return (
    <div
      className={clsx(
        "bg-white p-4 rounded-lg border transition-all",
        item.isActive ? "border-[#511f29]/10" : "border-gray-200 opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="cursor-move text-gray-300 hover:text-gray-500 mt-1">
          <GripVertical size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                {item.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-medium text-[#000000] text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">{item.location}</div>
            </div>
          </div>

          <div className="text-[#3c161e] text-xs mb-2" aria-label={`${item.rating}/${MAX_RATING}`}>
            {"★".repeat(item.rating)}
            <span className="text-gray-300">{"★".repeat(Math.max(0, MAX_RATING - item.rating))}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3">{item.text}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onToggleActive}
          className={clsx(
            "px-2 py-1 text-xs rounded",
            item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          )}
        >
          {item.isActive ? "Actif" : "Inactif"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Modifier"
          className="p-1.5 text-gray-400 hover:text-[#3c161e] hover:bg-[#511f29]/5 rounded"
        >
          <Edit2 size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer"
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
