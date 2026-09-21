export const TESTIMONIALS_CACHE_TAG = "testimonials";

export const ADMIN_SETTINGS_PATH = "/admin/reglages";

export const MAX_RATING = 5;

export const RATING_VALUES = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

export const FEEDBACK_DURATION_MS = 3000;

export const TESTIMONIAL_IMAGE_BUCKET = "store";

export const EMPTY_TESTIMONIAL_FORM = {
  name: "",
  location: "",
  image: "",
  text: "",
  rating: MAX_RATING,
  isActive: true,
} as const;
