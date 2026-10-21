export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]">{children}</table>
    </div>
  );
}

export function Th({ children, align = "left" }: { children?: React.ReactNode; align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={`border-b border-[var(--som-border)] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--som-gray)] text-${align} lg:px-6`}
    >
      {children}
    </th>
  );
}

export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--som-border)] last:border-b-0 transition-colors hover:bg-[var(--som-surface-alt)] ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  align = "left",
  muted = false,
}: {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  muted?: boolean;
}) {
  return (
    <td
      className={`px-5 py-4 align-middle lg:px-6 text-${align} ${muted ? "font-light text-[var(--som-gray)]" : "text-[var(--som-ink)]"}`}
    >
      {children}
    </td>
  );
}
