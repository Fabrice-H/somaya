import { Save, X } from "lucide-react";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { TESTIMONIAL_IMAGE_BUCKET } from "@/features/testimonials/constants";
import { TestimonialRatingInput } from "./TestimonialRatingInput";
import type { TestimonialFormValues } from "@/features/testimonials/types";

const INPUT_CLASS =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10";
const LABEL_CLASS = "block text-sm font-medium text-[#000000] mb-1.5";

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
    <div className="bg-white p-6 rounded-lg border border-[#511f29]/10 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#000000]">
          {isEditing ? "Modifier le témoignage" : "Nouveau témoignage"}
        </h2>
        <button type="button" onClick={onClose} aria-label="Fermer" className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="testimonial-name" className={LABEL_CLASS}>
              Nom
            </label>
            <input
              id="testimonial-name"
              type="text"
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Aminata K."
            />
          </div>
          <div>
            <label htmlFor="testimonial-location" className={LABEL_CLASS}>
              Lieu
            </label>
            <input
              id="testimonial-location"
              type="text"
              value={values.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Cocody, Abidjan"
            />
          </div>
        </div>

        <div>
          <label htmlFor="testimonial-text" className={LABEL_CLASS}>
            Témoignage
          </label>
          <textarea
            id="testimonial-text"
            value={values.text}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={4}
            className={`${INPUT_CLASS} resize-none`}
            placeholder="Le témoignage du client..."
          />
        </div>

        <div>
          <span className={LABEL_CLASS}>Note</span>
          <TestimonialRatingInput value={values.rating} onChange={(rating) => onChange({ rating })} />
        </div>

        <div>
          <span className="block text-sm font-medium text-[#000000] mb-2">Photo</span>
          <ImageUpload
            images={values.image ? [values.image] : []}
            onChange={(urls) => onChange({ image: urls[0] || "" })}
            bucket={TESTIMONIAL_IMAGE_BUCKET}
            maxImages={1}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-[#3c161e] focus:ring-black/10"
          />
          <span className="text-sm text-[#000000]">Actif</span>
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={isPending || !values.name.trim() || !values.text.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#511f29] text-white rounded-lg hover:bg-[#3d161f] disabled:opacity-50 transition-colors"
        >
          <Save size={18} />
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
