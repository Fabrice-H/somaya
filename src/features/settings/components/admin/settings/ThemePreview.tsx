type ThemePreviewProps = {
  storeName: string;
  primary: string;
  secondary: string;
};

export function ThemePreview({ storeName, primary, secondary }: ThemePreviewProps) {
  return (
    <div className="pt-6 border-t border-[#511f29]/10">
      <h3 className="text-sm font-semibold text-[#000000] mb-4">Aperçu</h3>
      <div className="p-6" style={{ background: "#fafafa", border: "1px solid rgba(81, 31, 41, 0.1)" }}>
        <div className="flex items-center justify-between p-4 mb-4" style={{ background: primary }}>
          <span className="font-semibold" style={{ color: secondary }}>
            {storeName || "SO'MAYA"}
          </span>
          <div className="flex gap-4 text-sm" style={{ color: secondary, opacity: 0.8 }}>
            <span>Catalogue</span>
            <span>Contact</span>
          </div>
        </div>
        <div className="flex gap-3">
          <span
            className="inline-block px-5 py-2.5 text-sm font-semibold"
            style={{ background: primary, color: secondary }}
          >
            Ajouter au panier
          </span>
          <span
            className="inline-block px-5 py-2.5 text-sm font-semibold border-2"
            style={{ borderColor: primary, color: primary }}
          >
            Voir plus
          </span>
        </div>
      </div>
    </div>
  );
}
