import type { ReactNode } from "react";
import { AccountNav } from "./AccountNav";
import { LogoutButton } from "./LogoutButton";

export function AccountShell({ firstName, children }: { firstName: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--som-border)] pb-6">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Espace client</p>
          <h1 className="m-0 mt-2 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[30px]">
            Bonjour {firstName}
          </h1>
        </div>
        <LogoutButton />
      </header>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
