import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { adminUsers, db } from "@/shared/lib/db";
import type { AdminUser } from "../types";
import { auth } from "./auth";

export const requireAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const admin = await db.query.adminUsers.findFirst({
    where: and(eq(adminUsers.id, id), eq(adminUsers.isActive, true)),
    columns: { id: true, email: true, name: true },
  });
  return admin ? { id: admin.id, email: admin.email, name: admin.name ?? "" } : null;
});

export async function assertAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (!admin) notFound();
  return admin;
}
