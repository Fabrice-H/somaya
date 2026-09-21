import { z } from "zod";
import { sanitizePlainText } from "@/shared/lib/sanitize";
import { HERO_LAYOUTS, HERO_MEDIA_TYPES } from "./constants";

const text = (max: number) =>
  z
    .string()
    .max(max, "Texte trop long")
    .nullable()
    .transform((value) => (value ? sanitizePlainText(value) || null : null));

const pattern = (max: number, regex: RegExp, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .refine((value) => value === "" || regex.test(value), message)
    .nullable()
    .transform((value) => value || null);

const color = pattern(50, /^#[0-9a-f]{3,8}$/i, "Couleur invalide");

export const heroBannerSchema = z.object({
  layout: z.enum(HERO_LAYOUTS),
  eyebrow: text(100),
  title: text(255),
  title_highlight: text(100),
  title_suffix: text(100),
  description: text(2000),
  button_text: text(100),
  button_link: pattern(255, /^(https?:\/\/|\/|#)/, "Lien invalide"),
  media_type: z.enum(HERO_MEDIA_TYPES),
  media_url: pattern(500, /^(https?:\/\/|\/)/, "URL du média invalide"),
  media_position: pattern(50, /^[a-z0-9%.\s-]+$/i, "Position invalide"),
  background_color: color,
  text_color: color,
  accent_color: color,
  is_active: z.boolean(),
});
