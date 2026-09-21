type AdminCardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function AdminCard({ title, description, action, padded = true, className = "", children }: AdminCardProps) {
  return (
    <section className={`border border-[var(--som-border)] bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-[var(--som-border)] px-5 py-4 lg:px-6">
          <div className="min-w-0">
            {title && (
              <h2 className="m-0 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)]">{title}</h2>
            )}
            {description && <p className="m-0 mt-1 text-[13px] font-light text-[var(--som-gray)]">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? "p-5 lg:p-6" : ""}>{children}</div>
    </section>
  );
}
