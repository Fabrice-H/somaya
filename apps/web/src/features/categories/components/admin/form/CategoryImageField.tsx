import { ImageUpload } from "@/features/media/components/ImageUpload";
import { CATEGORY_IMAGE_BUCKET } from "@/features/categories/constants";

type CategoryImageFieldProps = {
  imageUrl: string | null | undefined;
  onChange: (url: string | null) => void;
};

export function CategoryImageField({ imageUrl, onChange }: CategoryImageFieldProps) {
  return (
    <div>
      <ImageUpload
        images={imageUrl ? [imageUrl] : []}
        onChange={(urls) => onChange(urls[0] || null)}
        bucket={CATEGORY_IMAGE_BUCKET}
        maxImages={1}
      />
      <p className="help-som m-0">Format carré recommandé, 800 × 800 px minimum.</p>
    </div>
  );
}
