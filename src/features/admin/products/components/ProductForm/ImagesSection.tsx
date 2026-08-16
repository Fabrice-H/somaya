"use client";

import { memo, useCallback } from "react";
import { useProductFormStore, useProductFormImages } from "../../store";
import { ImageUploader } from "../ImageUploader";

export const ImagesSection = memo(function ImagesSection() {
  const images = useProductFormImages();
  const setField = useProductFormStore((s) => s.setField);

  const handleImagesChange = useCallback(
    (newImages: string[]) => {
      setField("images", newImages);
    },
    [setField]
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-[#511F29] mb-4">Images</h3>
      <ImageUploader
        images={images}
        onChange={handleImagesChange}
        bucket="products"
        maxImages={5}
      />
    </div>
  );
});
