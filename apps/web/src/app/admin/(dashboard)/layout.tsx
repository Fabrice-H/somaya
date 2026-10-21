import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { assertAdmin } from "@/features/auth/server/session";
import { AdminShell } from "@/shared/components/admin/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await assertAdmin();
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
