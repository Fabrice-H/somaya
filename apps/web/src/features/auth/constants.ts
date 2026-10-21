export const ADMIN_HOME_PATH = "/admin";
export const INTERNAL_LOGIN_PATH = "/admin/login";
export const DEFAULT_LOGIN_PATH = "/admin/login";

export const ADMIN_SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export const ACCOUNT_PATH = "/compte";
export const ACCOUNT_LOGIN_PATH = "/compte/connexion";
export const ACCOUNT_REGISTER_PATH = "/compte/inscription";
export const ACCOUNT_PUBLIC_PATHS = [ACCOUNT_LOGIN_PATH, ACCOUNT_REGISTER_PATH] as const;

export const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;

export const ROLES = ["admin", "customer"] as const;
