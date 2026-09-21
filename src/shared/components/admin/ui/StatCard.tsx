import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary";
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 border border-[var(--som-border)] bg-white p-5 lg:p-6">
      <div className="min-w-0">
        <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">{label}</p>
        <p
          className={`m-0 mt-3 text-[26px] font-light leading-none tabular-nums lg:text-[30px] ${
            tone === "primary" ? "text-[var(--som-primary)]" : "text-[var(--som-ink)]"
          }`}
        >
          {value}
        </p>
        {hint && <p className="m-0 mt-2 text-[12px] font-light text-[var(--som-gray)]">{hint}</p>}
      </div>
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--som-primary-50)] text-[var(--som-primary)]">
          <Icon size={18} strokeWidth={1.4} aria-hidden />
        </span>
      )}
    </div>
  );
}
