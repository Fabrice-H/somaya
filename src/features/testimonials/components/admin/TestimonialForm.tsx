import { Loader2, X } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { TESTIMONIAL_IMAGE_BUCKET } from "@/features/testimonials/constants";
import { TestimonialRatingInput } from "./TestimonialRatingInput";
import type { TestimonialFormValues } from "@/features/testimonials/types";

type TestimonialFormProps = {
  values: TestimonialFormValues;
  isEditing: boolean;
  isPending: boolean;
  onChange: (updates: Partial<TestimonialFormValues>) => void;
  onSave: () => void;
  onClose: () => void;
};

export function TestimonialForm({ values, isEditing, isPending, onChange, onSave, onClose }: TestimonialFormProps) {
  return (
    <AdminCard
      title={isEditing ? "Modifier le témoignage" : "Nouveau témoignage"}
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="-mr-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
        >
          <X size={18} strokeWidth={1.5} aria-hidden />
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="testimonial-name" label="Nom" required>
            <input
              id="testimonial-name"
              type="text"
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="input-som"
              placeholder="Aminata K."
            />
          </Field>
          <Field id="testimonial-location" label="Lieu">
            <input
              id="testimonial-location"
              type="text"
              value={values.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="input-som"
              placeholder="Cocody, Abidjan"
            />
          </Field>
        </div>

        <Field id="testimonial-text" label="Témoignage" required>
          <textarea
            id="testimonial-text"
            value={values.text}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={4}
            className="input-som"
            placeholder="Le témoignage du client…"
          />
        </Field>

        <div>
          <span className="label-som">Note</span>
          <TestimonialRatingInput value={values.rating} onChange={(rating) => onChange({ rating })} />
        </div>

        <div>
          <span className="label-som">Photo</span>
          <ImageUpload
            images={values.image ? [values.image] : []}
            onChange={(urls) => onChange({ image: urls[0] || "" })}
            bucket={TESTIMONIAL_IMAGE_BUCKET}
            maxImages={1}
          />
        </div>

        <label className="flex min-h-10 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
            className="h-5 w-5 shrink-0 cursor-pointer accent-[var(--som-primary)]"
          />
          <span className="text-[14px] text-[var(--som-ink)]">Afficher sur le site</span>
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={isPending || !values.name.trim() || !values.text.trim()}
          className="btn-primary w-full"
        >
          {isPending && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </AdminCard>
  );
}
