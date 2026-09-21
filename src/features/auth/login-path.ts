import { DEFAULT_LOGIN_PATH } from "./constants";

const LOGIN_PATH_PATTERN = /^\/[a-z0-9][a-z0-9-]{7,63}$/;

export function getLoginPath(): string {
  const configured = process.env.ADMIN_LOGIN_PATH?.trim().toLowerCase();
  if (configured && LOGIN_PATH_PATTERN.test(configured) && !configured.startsWith("/admin")) return configured;
  return DEFAULT_LOGIN_PATH;
}
