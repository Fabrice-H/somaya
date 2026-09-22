export { ACCOUNT_LOGIN_PATH, ACCOUNT_PATH, ACCOUNT_REGISTER_PATH } from "@/features/auth/constants";

export const ACCOUNT_ORDERS_PATH = "/compte/commandes";
export const ACCOUNT_PROFILE_PATH = "/compte/informations";

export const PASSWORD_MIN_LENGTH = 8;
export const ACCOUNT_ORDERS_LIMIT = 50;
export const CLAIM_MAX_AGE_MS = 60 * 60 * 1000;

export const REGISTER_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 } as const;
export const CLAIM_RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 } as const;

export const ACCOUNT_NAV = [
  { label: "Vue d'ensemble", href: "/compte" },
  { label: "Mes commandes", href: "/compte/commandes" },
  { label: "Mes informations", href: "/compte/informations" },
] as const;
