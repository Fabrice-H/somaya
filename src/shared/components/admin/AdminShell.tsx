import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
