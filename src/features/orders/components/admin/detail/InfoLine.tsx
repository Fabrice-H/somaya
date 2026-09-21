import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function InfoLine({ icon: Icon, label, children }: { icon: LucideIcon; label?: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-[var(--som-gray)]" />
      <div className="min-w-0 text-[14px] text-[var(--som-ink)]">
        {label && <p className="m-0 mb-1 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">{label}</p>}
        {children}
      </div>
    </div>
  );
}

export function InfoDivider() {
  return <div aria-hidden className="h-px bg-[var(--som-border)]" />;
}
