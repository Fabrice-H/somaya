import { DollarSign, Image as ImageIcon, Package, Settings2 } from "lucide-react";
import type { ProductFormTab } from "@/features/products/types";

const TABS = [
  { key: "general", label: "Général", Icon: Package },
  { key: "images", label: "Images", Icon: ImageIcon },
  { key: "pricing", label: "Prix & Stock", Icon: DollarSign },
  { key: "settings", label: "Options", Icon: Settings2 },
] as const satisfies readonly { key: ProductFormTab; label: string; Icon: typeof Package }[];

interface ProductFormTabsProps {
  active: ProductFormTab;
  onChange: (tab: ProductFormTab) => void;
}

export function ProductFormTabs({ active, onChange }: ProductFormTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto bg-[#fafafa] border-b border-[#511f29]/10" style={{ padding: "0 40px" }}>
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className="inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          style={{
            padding: "14px 20px",
            fontSize: 13,
            fontWeight: 500,
            color: active === key ? "#511f29" : "#6b6b6b",
            borderBottom: active === key ? "2px solid #511f29" : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
