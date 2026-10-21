import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--som-surface-alt)]">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="min-h-screen pt-14 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
