import type { Testimonial } from "@/shared/lib/db/schema";
import type { TestimonialData } from "../types";

export function toTestimonialData(row: Testimonial): TestimonialData {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    image: row.image,
    text: row.text,
    rating: row.rating,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}
