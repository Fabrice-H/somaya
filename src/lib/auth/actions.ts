"use server";

import { auth } from "./index";
import { redirect } from "next/navigation";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export async function requireAdmin(): Promise<AdminUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email || "",
    name: session.user.name || "",
  };
}

export async function requireAdminOrRedirect(): Promise<AdminUser> {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
