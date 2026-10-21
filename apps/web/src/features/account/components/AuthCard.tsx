import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  text,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[520px] px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
      <header className="text-center">
        <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">{eyebrow}</p>
        <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[30px]">
          {title}
        </h1>
        <p className="mx-auto mb-0 mt-3 max-w-[400px] text-[14px] font-light leading-relaxed text-[#4a4a4a]">{text}</p>
      </header>
      <div className="mt-10 border border-[var(--som-border)] p-6 md:p-8">{children}</div>
      <p className="m-0 mt-6 text-center text-[13px] font-light text-[#4a4a4a]">{footer}</p>
    </div>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`m-0 px-4 py-3 text-[13px] ${error ? "bg-[var(--som-error-tint)] text-[var(--som-error)]" : "bg-[#e8f3ec] text-[var(--som-success)]"}`}
    >
      {error ?? success}
    </p>
  );
}
