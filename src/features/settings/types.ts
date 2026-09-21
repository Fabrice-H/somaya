export type StoreContact = {
  phone: string;
  whatsapp: string;
  email: string | null;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

export type StoreSettings = {
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
};

export type SettingsInput = {
  store_name: string;
  tagline: string;
  logo_url: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  instagram_handle: string;
  facebook_url: string;
  tiktok_handle: string;
  delivery_fee: number;
  delivery_hours: string;
  primary_color: string;
  secondary_color: string;
};

export type SettingsFieldUpdater = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => void;

export type ActionResult = { success: boolean; error?: string };
