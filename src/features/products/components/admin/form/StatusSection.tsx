"use client";

import { useProductFormStatus, useProductFormStore } from "@/features/products/stores/product-form-store";
import { StatusRow, StatusToggle } from "./StatusRow";

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394786b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

export function StatusSection() {
  const { is_active, is_new, is_featured } = useProductFormStatus();
  const setField = useProductFormStore((s) => s.setField);

  return (
    <div className="bg-white" style={{ border: "1px dashed rgba(81, 31, 41, 0.2)", padding: 32 }}>
      <StatusRow title="Produit actif" description="Visible dans le catalogue et disponible à l'achat">
        <StatusToggle checked={is_active} onToggle={() => setField("is_active", !is_active)} />
      </StatusRow>

      <StatusRow title="Coup de coeur" description="Mis en avant sur la page d'accueil">
        <StatusToggle checked={is_featured} onToggle={() => setField("is_featured", !is_featured)} />
      </StatusRow>

      <StatusRow title="Badge Nouveauté" description={'Afficher le badge "NEW" sur ce produit'} bordered={false}>
        <select
          value={is_new ? "yes" : "no"}
          onChange={(e) => setField("is_new", e.target.value === "yes")}
          className="h-11 px-4 pr-10 bg-transparent border border-[var(--som-border-input)] hover:border-[var(--som-border-input-hover)] text-[#000000] text-sm outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-black/10"
          style={{
            backgroundImage: SELECT_ARROW,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            minWidth: 160,
          }}
        >
          <option value="yes">Oui</option>
          <option value="no">Non</option>
        </select>
      </StatusRow>
    </div>
  );
}
