import { AdminShell } from "@/shared/components/admin/AdminShell";
import { SessionProvider } from "next-auth/react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
