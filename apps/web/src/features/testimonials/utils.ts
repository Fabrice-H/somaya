import type { TestimonialData, TestimonialFormValues } from "./types";

export function toTestimonialFormValues(item: TestimonialData): TestimonialFormValues {
  return {
    name: item.name,
    location: item.location ?? "",
    image: item.image ?? "",
    text: item.text,
    rating: item.rating,
    isActive: item.isActive,
  };
}

export function toTestimonialPayload(values: TestimonialFormValues) {
  return {
    ...values,
    location: values.location.trim() || null,
    image: values.image || null,
  };
}
