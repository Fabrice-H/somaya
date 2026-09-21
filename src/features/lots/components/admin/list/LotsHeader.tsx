import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";

type LotsHeaderProps = {
  totalLots: number;
  totalArticles: number;
};

export function LotsHeader({ totalLots, totalArticles }: LotsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6b6b] mb-1">BOUTIQUE / PAR BUDGET</p>
        <h1 className="font-[family-name:var(--font-stack)] text-3xl text-[#000000]">Lots de prix</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#000000] font-medium hidden md:block">
          {totalLots} LOTS · {totalArticles} ARTICLES
        </span>
        <Link
          href={`${ADMIN_LOTS_PATH}/nouveau`}
          className="inline-flex items-center gap-2 bg-[#511f29] text-white px-5 py-2.5 rounded-none font-medium text-sm tracking-wide hover:bg-[#3d171f] transition-colors"
        >
          <Plus size={16} />
          NOUVEAU LOT
        </Link>
      </div>
    </div>
  );
}
