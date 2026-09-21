import Link from "next/link";

export const navLinkClass =
  "group relative inline-flex h-11 items-center text-[12px] font-normal uppercase tracking-[0.16em] text-[#555] transition-colors duration-200 hover:text-[var(--som-ink)]";

export function NavUnderline({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute bottom-2 left-0 h-px w-full origin-left bg-[var(--som-primary)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

export function NavLink({
  href,
  active,
  className = "",
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`${navLinkClass} ${className}`}>
      {children}
      <NavUnderline active={active} />
    </Link>
  );
}
