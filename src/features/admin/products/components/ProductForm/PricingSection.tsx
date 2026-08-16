"use client";

import { memo } from "react";
import { useProductFormStore } from "../../store";

export const PricingSection = memo(function PricingSection() {
  const price = useProductFormStore((s) => s.form.price);
  const sku = useProductFormStore((s) => s.form.sku);
  const stock = useProductFormStore((s) => s.form.stock);
  const lowStockThreshold = useProductFormStore((s) => s.form.low_stock_threshold);
  const setField = useProductFormStore((s) => s.setField);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-[#511F29] mb-4">Tarification</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
            Prix (FCFA) *
          </label>
          <input
            type="number"
            value={price || ""}
            onChange={(e) => {
              const val = e.target.value;
              setField("price", val === "" ? 0 : parseInt(val) || 0);
            }}
            required
            min={0}
            max={100000000}
            className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                     focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                     text-[#511F29]"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
            SKU
          </label>
          <input
            type="text"
            value={sku || ""}
            onChange={(e) => setField("sku", e.target.value || null)}
            placeholder="Ex: PRD-001"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                     focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                     text-[#511F29]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
              Stock
            </label>
            <input
              type="number"
              value={stock || ""}
              onChange={(e) => {
                const val = e.target.value;
                setField("stock", val === "" ? 0 : parseInt(val) || 0);
              }}
              min={0}
              max={1000000}
              className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                       focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                       text-[#511F29]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
              Seuil alerte
            </label>
            <input
              type="number"
              value={lowStockThreshold || ""}
              onChange={(e) => {
                const val = e.target.value;
                setField("low_stock_threshold", val === "" ? 0 : parseInt(val) || 0);
              }}
              min={0}
              max={10000}
              className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                       focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                       text-[#511F29]"
              placeholder="5"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
