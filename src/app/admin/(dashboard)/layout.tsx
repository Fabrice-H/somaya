import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminShell } from "@/shared/components/admin/AdminShell";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
