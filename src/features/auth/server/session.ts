import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { adminUsers, db } from "@/shared/lib/db";
import { ADMIN_SESSION_MAX_AGE_MS } from "../constants";
import type { AdminUser, SessionIdentity } from "../types";
import { auth } from "./auth";

export const getSessionIdentity = cache(async (): Promise<SessionIdentity | null> => {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.role) return null;
  return { id: user.id, role: user.role, issuedAt: user.issuedAt ?? 0 };
});

export const isAdminSessionFresh = (issuedAt: number, now = Date.now()) =>
  issuedAt > 0 && now - issuedAt <= ADMIN_SESSION_MAX_AGE_MS;

export const requireAdmin = cache(async (): Promise<AdminUser | null> => {
  const identity = await getSessionIdentity();
  if (!identity || identity.role !== "admin" || !isAdminSessionFresh(identity.issuedAt)) return null;

  const admin = await db.query.adminUsers.findFirst({
    where: and(eq(adminUsers.id, identity.id), eq(adminUsers.isActive, true)),
    columns: { id: true, email: true, name: true },
  });
  return admin ? { id: admin.id, email: admin.email, name: admin.name ?? "" } : null;
});

export async function assertAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (!admin) notFound();
  return admin;
}
