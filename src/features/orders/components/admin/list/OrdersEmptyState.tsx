import { Package } from "lucide-react";

export function OrdersEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div
      className="text-center"
      style={{ padding: "64px 20px", background: "#fafafa", border: "1px solid rgba(81,31,41,0.1)" }}
    >
      <Package size={48} style={{ color: "#6b6b6b", margin: "0 auto 16px", opacity: 0.5 }} />
      <p style={{ fontSize: 16, fontWeight: 500, color: "#000000", marginBottom: 4 }}>Aucune commande trouvée</p>
      <p style={{ fontSize: 14, color: "#6b6b6b" }}>
        {filtered ? "Essayez de modifier vos filtres" : "Les commandes apparaîtront ici"}
      </p>
    </div>
  );
}
