import { Sidebar } from "./Sidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#faf6f1]">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
