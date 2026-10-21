import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

type Role = "admin" | "customer";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      issuedAt: number;
      guest: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
    guest?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: Role;
    issuedAt?: number;
    guest?: boolean;
  }
}
