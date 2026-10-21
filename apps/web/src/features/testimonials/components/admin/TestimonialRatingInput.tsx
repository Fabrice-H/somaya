import { RATING_VALUES } from "@/features/testimonials/constants";

type TestimonialRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function TestimonialRatingInput({ value, onChange }: TestimonialRatingInputProps) {
  return (
    <div className="-ml-2 flex">
      {RATING_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          aria-pressed={star <= value}
          className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center text-[22px] leading-none transition-colors ${
            star <= value ? "text-[var(--som-primary)]" : "text-[var(--som-border-strong)] hover:text-[var(--som-gray)]"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
