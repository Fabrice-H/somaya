import { z } from "zod";
import { sanitizePlainText } from "@/shared/lib/sanitize";

const PHONE_REGEX = /^[0-9+\-\s()]{0,20}$/;
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const SOCIAL_HANDLE_REGEX = /^@?[a-zA-Z0-9._]{0,50}$/;
const URL_REGEX = /^(https?:\/\/[^\s<>"{}|\\^`[\]]*)?$/;

const optionalText = (max: number, message: string) =>
  z
    .string()
    .max(max, message)
    .transform((value) => sanitizePlainText(value) || null);

const optionalMatch = (max: number, regex: RegExp, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .regex(regex, message)
    .transform((value) => value || null);

const handle = optionalMatch(51, SOCIAL_HANDLE_REGEX, "Identifiant invalide").transform(
  (value) => value?.replace(/^@/, "") || null
);

export const settingsSchema = z.object({
  store_name: z
    .string()
    .max(255, "Le nom est trop long")
    .transform(sanitizePlainText)
    .refine(Boolean, "Le nom est requis"),
  tagline: optionalText(500, "Le slogan est trop long"),
  logo_url: optionalMatch(500, URL_REGEX, "URL invalide"),
  whatsapp_number: optionalMatch(20, PHONE_REGEX, "Numéro invalide"),
  phone_number: optionalMatch(20, PHONE_REGEX, "Numéro invalide"),
  email: z
    .union([z.literal(""), z.email("Email invalide").max(255, "Email trop long")])
    .transform((value) => value || null),
  address: optionalText(1000, "Adresse trop longue"),
  instagram_handle: handle,
  facebook_url: optionalMatch(500, URL_REGEX, "URL invalide"),
  tiktok_handle: handle,
  delivery_fee: z.number().min(0, "Les frais doivent être positifs").max(1000000, "Montant trop élevé"),
  delivery_hours: optionalText(255, "Texte trop long"),
  primary_color: z.string().regex(HEX_COLOR_REGEX, "Couleur invalide"),
  secondary_color: z.string().regex(HEX_COLOR_REGEX, "Couleur invalide"),
});
