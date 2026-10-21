import type { ReactNode } from "react";

type ErrorStateProps = {
  code: string;
  title: string;
  text: string;
  actions: ReactNode;
  footnote?: ReactNode;
  compact?: boolean;
};

export function ErrorState({ code, title, text, actions, footnote, compact = false }: ErrorStateProps) {
  return (
    <section
      className={`flex items-center justify-center px-6 text-center ${compact ? "min-h-[60vh] py-16" : "min-h-[72vh] py-24"}`}
    >
      <div className="relative max-w-[560px]">
        <p
          aria-hidden
          className="pointer-events-none m-0 select-none text-[clamp(120px,22vw,220px)] font-light leading-none tracking-[-0.04em] text-[var(--som-primary-50)]"
        >
          {code}
        </p>
        <div className="-mt-[clamp(40px,7vw,72px)]">
          <p className="m-0 mb-5 text-[11.5px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Erreur {code}</p>
          <h1 className="m-0 text-[clamp(28px,4vw,40px)] font-light leading-[1.15] tracking-[-0.01em] text-[var(--som-ink)]">
            {title}
          </h1>
          <p className="mx-auto mb-10 mt-5 max-w-[440px] text-[15px] font-light leading-[1.7] text-[#4a4a4a]">{text}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div>
          {footnote && <p className="m-0 mt-8 text-[12px] font-light text-[var(--som-gray)]">{footnote}</p>}
        </div>
      </div>
    </section>
  );
}
