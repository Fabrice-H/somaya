import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center bg-[var(--som-primary-50)] text-[var(--som-primary)]">
        <Icon size={20} strokeWidth={1.4} aria-hidden />
      </span>
      <p className="m-0 mt-5 text-[15px] font-medium text-[var(--som-ink)]">{title}</p>
      {description && (
        <p className="m-0 mt-1.5 max-w-[360px] text-[13px] font-light text-[var(--som-gray)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
