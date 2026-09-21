import clsx from "clsx";
import { RATING_VALUES } from "@/features/testimonials/constants";

type TestimonialRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function TestimonialRatingInput({ value, onChange }: TestimonialRatingInputProps) {
  return (
    <div className="flex gap-1">
      {RATING_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          className={clsx("text-2xl transition-colors", star <= value ? "text-[#3c161e]" : "text-gray-300")}
        >
          ★
        </button>
      ))}
    </div>
  );
}
