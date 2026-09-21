import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface OrderPanelProps {
  title: ReactNode;
  icon?: LucideIcon;
  children: ReactNode;
}

export function OrderPanel({ title, icon: Icon, children }: OrderPanelProps) {
  return (
    <section style={{ background: "white", border: "1px solid rgba(81,31,41,0.1)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(81,31,41,0.1)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#000000" }}>
          {Icon && <Icon size={16} className="inline mr-2" style={{ verticalAlign: "middle" }} />}
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
