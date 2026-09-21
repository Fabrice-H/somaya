type ThemePreviewProps = {
  storeName: string;
  primary: string;
  secondary: string;
};

export function ThemePreview({ storeName, primary, secondary }: ThemePreviewProps) {
  return (
    <div className="border border-[var(--som-border)] bg-[var(--som-surface-alt)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4" style={{ background: primary }}>
        <span className="text-[14px] font-medium uppercase tracking-[0.2em]" style={{ color: secondary }}>
          {storeName || "SO'MAYA"}
        </span>
        <div className="flex gap-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: secondary, opacity: 0.8 }}>
          <span>Catalogue</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 p-6">
        <span
          className="inline-flex min-h-10 items-center px-6 text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{ background: primary, color: secondary }}
        >
          Ajouter au panier
        </span>
        <span
          className="inline-flex min-h-10 items-center border px-6 text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{ borderColor: primary, color: primary }}
        >
          Voir plus
        </span>
      </div>
    </div>
  );
}
