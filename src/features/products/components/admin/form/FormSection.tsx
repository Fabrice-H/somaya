import type { ReactNode } from "react";

interface FormSectionProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ step, title, description, children }: FormSectionProps) {
  const id = `product-section-${step}`;
  return (
    <section aria-labelledby={id} className="border border-[var(--som-border)] bg-white">
      <header className="flex items-baseline gap-3 border-b border-[var(--som-border)] px-5 py-4 lg:px-6">
        <span className="text-[13px] font-medium tabular-nums text-[var(--som-primary)]">
          {String(step).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h2 id={id} className="m-0 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)]">
            {title}
          </h2>
          {description && <p className="m-0 mt-1 text-[13px] font-light text-[var(--som-gray)]">{description}</p>}
        </div>
      </header>
      <div className="p-5 lg:p-6">{children}</div>
    </section>
  );
}
