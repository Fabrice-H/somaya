import "server-only";
import { auth } from "./auth";
import type { AdminUser } from "../types";

export class UnauthorizedError extends Error {
  constructor() {
    super("Non autorisé");
  }
}

export async function requireAdmin(): Promise<AdminUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id, email: session.user.email ?? "", name: session.user.name ?? "" };
}

export async function assertAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}
