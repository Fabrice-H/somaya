import { AdminShell } from "@/features/admin/components/AdminShell";
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
