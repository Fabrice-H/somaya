"use client";

import { useProductFormImages, useProductFormStore } from "@/features/products/stores/product-form-store";
import { PRODUCT_MAX_IMAGES } from "@/features/products/constants";
import { ImageUploader } from "../image-uploader/ImageUploader";
import { FormCard } from "./FormCard";

export function ImagesSection() {
  const images = useProductFormImages();
  const setField = useProductFormStore((s) => s.setField);

  return (
    <FormCard title="Images">
      <ImageUploader
        images={images}
        onChange={(next) => setField("images", next)}
        bucket="products"
        maxImages={PRODUCT_MAX_IMAGES}
      />
    </FormCard>
  );
}
