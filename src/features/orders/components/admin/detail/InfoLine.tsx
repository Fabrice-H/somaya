import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function InfoLine({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} style={{ color: "#6b6b6b", marginTop: 2 }} />
      <div>{children}</div>
    </div>
  );
}

export function InfoDivider() {
  return <div style={{ height: 1, background: "rgba(81,31,41,0.1)", margin: "8px 0" }} />;
}
