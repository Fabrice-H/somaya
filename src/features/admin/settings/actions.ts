"use server";

import { db, storeSettings } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { StoreSettings as DbStoreSettings } from "@/lib/db/schema";
import DOMPurify from "isomorphic-dompurify";

// ============================================================
// TYPES
// ============================================================

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string | null;
  logo_url: string | null;
  whatsapp_number: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  instagram_handle: string | null;
  facebook_url: string | null;
  tiktok_handle: string | null;
  delivery_fee: number;
  delivery_hours: string | null;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

// Regex patterns for security
const PHONE_REGEX = /^[0-9+\-\s()]{0,20}$/;
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const SOCIAL_HANDLE_REGEX = /^[a-zA-Z0-9._]{0,50}$/;
const URL_REGEX = /^(https?:\/\/[^\s<>"{}|\\^`[\]]*)?$/;

const settingsSchema = z.object({
  store_name: z
    .string()
    .min(1, "Le nom est requis")
    .max(255, "Le nom est trop long")
    .transform((val) => sanitizeText(val)),
  tagline: z
    .string()
    .max(500, "Le slogan est trop long")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeText(val) : null)),
  logo_url: z
    .string()
    .max(500, "URL trop longue")
    .regex(URL_REGEX, "URL invalide")
    .optional()
    .nullable(),
  whatsapp_number: z
    .string()
    .max(20, "Numéro trop long")
    .regex(PHONE_REGEX, "Numéro invalide")
    .optional()
    .nullable(),
  phone_number: z
    .string()
    .max(20, "Numéro trop long")
    .regex(PHONE_REGEX, "Numéro invalide")
    .optional()
    .nullable(),
  email: z
    .string()
    .email("Email invalide")
    .max(255, "Email trop long")
    .optional()
    .nullable()
    .or(z.literal("")),
  address: z
    .string()
    .max(1000, "Adresse trop longue")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeText(val) : null)),
  instagram_handle: z
    .string()
    .max(50, "Identifiant trop long")
    .regex(SOCIAL_HANDLE_REGEX, "Identifiant invalide")
    .optional()
    .nullable(),
  facebook_url: z
    .string()
    .max(500, "URL trop longue")
    .regex(URL_REGEX, "URL invalide")
    .optional()
    .nullable(),
  tiktok_handle: z
    .string()
    .max(50, "Identifiant trop long")
    .regex(SOCIAL_HANDLE_REGEX, "Identifiant invalide")
    .optional()
    .nullable(),
  delivery_fee: z
    .number()
    .min(0, "Les frais doivent être positifs")
    .max(1000000, "Montant trop élevé")
    .default(1500),
  delivery_hours: z
    .string()
    .max(255, "Texte trop long")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeText(val) : null)),
  primary_color: z
    .string()
    .regex(HEX_COLOR_REGEX, "Couleur invalide")
    .default("#511F29"),
  secondary_color: z
    .string()
    .regex(HEX_COLOR_REGEX, "Couleur invalide")
    .default("#fcd3b4"),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ============================================================
// HELPERS
// ============================================================

/**
 * Sanitize text input to prevent XSS attacks
 */
function sanitizeText(text: string): string {
  // Remove any HTML tags and trim whitespace
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim();
}

/**
 * Convert database settings to admin format (snake_case for frontend)
 */
function toAdminSettings(settings: DbStoreSettings): StoreSettings {
  return {
    id: settings.id,
    store_name: settings.storeName,
    tagline: settings.tagline,
    logo_url: settings.logoUrl,
    whatsapp_number: settings.whatsappNumber,
    phone_number: settings.phoneNumber,
    email: settings.email,
    address: settings.address,
    instagram_handle: settings.instagramHandle,
    facebook_url: settings.facebookUrl,
    tiktok_handle: settings.tiktokHandle,
    delivery_fee: Number(settings.deliveryFee || 0),
    delivery_hours: settings.deliveryHours,
    primary_color: settings.primaryColor || "#511F29",
    secondary_color: settings.secondaryColor || "#fcd3b4",
    created_at: settings.createdAt.toISOString(),
    updated_at: settings.updatedAt.toISOString(),
  };
}

// ============================================================
// ACTIONS
// ============================================================

/**
 * Get store settings (admin only)
 * Uses parameterized queries via Drizzle ORM
 */
export async function getSettings(): Promise<StoreSettings | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    // Drizzle uses parameterized queries internally
    const result = await db.query.storeSettings.findFirst();

    if (!result) return null;
    return toAdminSettings(result);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

/**
 * Update store settings (admin only)
 * - Validates input with Zod
 * - Sanitizes text fields
 * - Uses parameterized queries
 */
export async function updateSettings(
  input: SettingsInput
): Promise<{ success: boolean; error?: string }> {
  // Auth check
  const admin = await requireAdmin();
  if (!admin) {
    return { success: false, error: "Non autorisé" };
  }

  // Validate and sanitize input
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Check if settings exist
    const existing = await db.query.storeSettings.findFirst();

    // Prepare data (converts snake_case to camelCase for DB)
    const settingsData = {
      storeName: parsed.data.store_name,
      tagline: parsed.data.tagline || null,
      logoUrl: parsed.data.logo_url || null,
      whatsappNumber: parsed.data.whatsapp_number || null,
      phoneNumber: parsed.data.phone_number || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      instagramHandle: parsed.data.instagram_handle || null,
      facebookUrl: parsed.data.facebook_url || null,
      tiktokHandle: parsed.data.tiktok_handle || null,
      deliveryFee: String(parsed.data.delivery_fee),
      deliveryHours: parsed.data.delivery_hours || null,
      primaryColor: parsed.data.primary_color,
      secondaryColor: parsed.data.secondary_color,
      updatedAt: new Date(),
    };

    if (!existing) {
      // Create new settings with fixed UUID (singleton pattern)
      await db.insert(storeSettings).values({
        id: "00000000-0000-0000-0000-000000000001",
        ...settingsData,
      });
    } else {
      // Update existing settings using parameterized query
      await db
        .update(storeSettings)
        .set(settingsData)
        .where(eq(storeSettings.id, existing.id));
    }

    // Revalidate cached pages
    revalidatePath("/admin/reglages");
    revalidateTag("store-settings", "max"); // Invalidate store settings cache

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Get public settings (for frontend, no auth required)
 * Cached for performance
 */
export async function getPublicSettings(): Promise<StoreSettings | null> {
  try {
    const result = await db.query.storeSettings.findFirst();

    if (!result) return null;
    return toAdminSettings(result);
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return null;
  }
}
