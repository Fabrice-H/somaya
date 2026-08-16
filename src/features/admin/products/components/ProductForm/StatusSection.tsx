"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { useProductFormStore, useProductFormStatus } from "../../store";

export const StatusSection = memo(function StatusSection() {
  const { is_active, is_new, is_featured } = useProductFormStatus();
  const setField = useProductFormStore((s) => s.setField);

  return (
    <div
      className="bg-white"
      style={{
        border: "1px dashed rgba(81, 31, 41, 0.2)",
        padding: 32,
      }}
    >
      <div className="space-y-0">
        {/* Produit actif */}
        <div
          className="flex items-center justify-between py-6"
          style={{ borderBottom: "1px solid rgba(81, 31, 41, 0.1)" }}
        >
          <div>
            <h4 className="text-base font-semibold text-[#2a181d] mb-1">
              Produit actif
            </h4>
            <p className="text-sm text-[#94786b]">
              Visible dans le catalogue et disponible à l&apos;achat
            </p>
          </div>
          <button
            type="button"
            onClick={() => setField("is_active", !is_active)}
            className="w-7 h-7 flex items-center justify-center border-2 transition-all"
            style={{
              borderColor: is_active ? "#2a181d" : "rgba(81, 31, 41, 0.3)",
              background: is_active ? "#2a181d" : "transparent",
            }}
          >
            {is_active && <Check size={16} className="text-white" strokeWidth={3} />}
          </button>
        </div>

        {/* Coup de coeur */}
        <div
          className="flex items-center justify-between py-6"
          style={{ borderBottom: "1px solid rgba(81, 31, 41, 0.1)" }}
        >
          <div>
            <h4 className="text-base font-semibold text-[#2a181d] mb-1">
              Coup de coeur
            </h4>
            <p className="text-sm text-[#94786b]">
              Mis en avant sur la page d&apos;accueil
            </p>
          </div>
          <button
            type="button"
            onClick={() => setField("is_featured", !is_featured)}
            className="w-7 h-7 flex items-center justify-center border-2 transition-all"
            style={{
              borderColor: is_featured ? "#2a181d" : "rgba(81, 31, 41, 0.3)",
              background: is_featured ? "#2a181d" : "transparent",
            }}
          >
            {is_featured && <Check size={16} className="text-white" strokeWidth={3} />}
          </button>
        </div>

        {/* Badge Nouveauté */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h4 className="text-base font-semibold text-[#2a181d] mb-1">
              Badge Nouveauté
            </h4>
            <p className="text-sm text-[#94786b]">
              Afficher le badge &quot;NEW&quot; sur ce produit
            </p>
          </div>
          <select
            value={is_new ? "yes" : "no"}
            onChange={(e) => setField("is_new", e.target.value === "yes")}
            className="h-11 px-4 pr-10 bg-transparent border border-[#511F29]/20 text-[#2a181d] text-sm outline-none cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394786b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 160,
            }}
          >
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
        </div>
      </div>
    </div>
  );
});
