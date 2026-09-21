"use client";

import { useProductFormImages, useProductFormStore } from "@/features/products/stores/product-form-store";
import { PRODUCT_MAX_IMAGES } from "@/features/products/constants";
import { ImageUploader } from "../image-uploader/ImageUploader";
import { FormSection } from "./FormSection";

export function PhotosSection() {
  const images = useProductFormImages();
  const setField = useProductFormStore((s) => s.setField);

  return (
    <FormSection
      step={1}
      title="Photos"
      description={`Jusqu'à ${PRODUCT_MAX_IMAGES} photos. La première est la photo principale ; faites glisser pour changer l'ordre.`}
    >
      <ImageUploader
        images={images}
        onChange={(next) => setField("images", next)}
        bucket="products"
        maxImages={PRODUCT_MAX_IMAGES}
      />
    </FormSection>
  );
}
