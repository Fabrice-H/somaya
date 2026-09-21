import type { StoreSettings as StoreSettingsRow } from "@/shared/lib/db/schema";
import { SETTINGS_DEFAULTS } from "./constants";
import type { SettingsInput, StoreSettings } from "./types";

export function toStoreSettings(row: StoreSettingsRow): StoreSettings {
  return {
    id: row.id,
    store_name: row.storeName,
    tagline: row.tagline,
    logo_url: row.logoUrl,
    whatsapp_number: row.whatsappNumber,
    phone_number: row.phoneNumber,
    email: row.email,
    address: row.address,
    instagram_handle: row.instagramHandle,
    facebook_url: row.facebookUrl,
    tiktok_handle: row.tiktokHandle,
    delivery_fee: Number(row.deliveryFee || 0),
    delivery_hours: row.deliveryHours,
    primary_color: row.primaryColor || SETTINGS_DEFAULTS.primaryColor,
    secondary_color: row.secondaryColor || SETTINGS_DEFAULTS.secondaryColor,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export function toSettingsInput(settings: StoreSettings | null): SettingsInput {
  return {
    store_name: settings?.store_name ?? SETTINGS_DEFAULTS.storeName,
    tagline: settings?.tagline || "",
    logo_url: settings?.logo_url || "",
    whatsapp_number: settings?.whatsapp_number || "",
    phone_number: settings?.phone_number || "",
    email: settings?.email || "",
    address: settings?.address || "",
    instagram_handle: settings?.instagram_handle || "",
    facebook_url: settings?.facebook_url || "",
    tiktok_handle: settings?.tiktok_handle || "",
    delivery_fee: settings?.delivery_fee ?? SETTINGS_DEFAULTS.deliveryFee,
    delivery_hours: settings?.delivery_hours || "",
    primary_color: settings?.primary_color ?? SETTINGS_DEFAULTS.primaryColor,
    secondary_color: settings?.secondary_color ?? SETTINGS_DEFAULTS.secondaryColor,
  };
}
