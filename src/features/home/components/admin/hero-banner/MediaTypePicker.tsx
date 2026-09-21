import clsx from "clsx";
import { Film, Image as ImageIcon } from "lucide-react";
import type { HeroMediaType } from "../../../types";

const OPTIONS = [
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Vidéo", icon: Film },
] as const;

type MediaTypePickerProps = {
  value: string;
  onChange: (value: HeroMediaType) => void;
};

export function MediaTypePicker({ value, onChange }: MediaTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {OPTIONS.map(({ value: option, label, icon: Icon }) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={clsx(
              "flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all",
              selected ? "border-[#511f29] bg-[#511f29]/5" : "border-gray-200 hover:border-[#511f29]/30"
            )}
          >
            <Icon size={24} className={selected ? "text-[#3c161e]" : "text-gray-400"} />
            <span className={clsx("font-medium", selected ? "text-[#3c161e]" : "text-gray-600")}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
