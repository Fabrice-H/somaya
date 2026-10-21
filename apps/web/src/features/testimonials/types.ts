import type { z } from "zod";
import type { testimonialSchema } from "./schemas";

export type TestimonialCard = {
  id: string;
  name: string;
  location: string | null;
  image: string | null;
  text: string;
  rating: number;
};

export type TestimonialData = TestimonialCard & {
  isActive: boolean;
  sortOrder: number;
};

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export type TestimonialFormValues = {
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
  isActive: boolean;
};

export type TestimonialActionResult = { success: boolean; error?: string; id?: string };

export type TestimonialsFeedback = { type: "success" | "error"; text: string };
