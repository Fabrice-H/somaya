import { ImageUpload } from "@/features/media/components/ImageUpload";
import { CATEGORY_IMAGE_BUCKET } from "@/features/categories/constants";

type CategoryImageFieldProps = {
  imageUrl: string | null | undefined;
  onChange: (url: string | null) => void;
};

export function CategoryImageField({ imageUrl, onChange }: CategoryImageFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#000000] mb-2">Image de la catégorie</label>
      <ImageUpload
        images={imageUrl ? [imageUrl] : []}
        onChange={(urls) => onChange(urls[0] || null)}
        bucket={CATEGORY_IMAGE_BUCKET}
        maxImages={1}
      />
      <p className="text-xs text-[#6b6b6b] mt-2">Format recommandé: carré, min 800x800px</p>
    </div>
  );
}
