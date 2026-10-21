import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AdminPageProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  children: React.ReactNode;
};

export function AdminPage({ title, eyebrow, description, actions, back, children }: AdminPageProps) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-8 lg:px-10 lg:pt-10">
      {back && (
        <Link
          href={back.href}
          className="mb-5 inline-flex min-h-9 items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden />
          {back.label}
        </Link>
      )}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-[var(--som-border)] pb-6 lg:mb-10">
        <div className="min-w-0">
          {eyebrow && (
            <p className="m-0 mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--som-primary)]">{eyebrow}</p>
          )}
          <h1 className="m-0 text-[24px] font-semibold tracking-[0.01em] text-[var(--som-ink)] lg:text-[28px]">
            {title}
          </h1>
          {description && <p className="m-0 mt-1.5 text-[14px] font-light text-[var(--som-gray)]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </header>
      {children}
    </div>
  );
}
