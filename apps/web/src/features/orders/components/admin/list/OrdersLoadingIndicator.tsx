import { Loader2 } from "lucide-react";

export function OrdersLoadingIndicator() {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]"
    >
      <Loader2 size={14} strokeWidth={1.5} className="animate-spin text-[var(--som-primary)]" aria-hidden />
      Chargement…
    </span>
  );
}
