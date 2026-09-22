import type { ROLES } from "./constants";

export type Role = (typeof ROLES)[number];

export type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export type SessionIdentity = {
  id: string;
  role: Role;
  issuedAt: number;
};

export type LoginState = {
  error?: string;
};
