import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";

export function LotsEmptyState() {
  return (
    <div className="text-center py-16">
      <Layers size={48} className="mx-auto text-[#e8ddd4] mb-4" />
      <p className="text-[#6b6b6b] mb-4">Aucun lot de prix créé</p>
      <Link
        href={`${ADMIN_LOTS_PATH}/nouveau`}
        className="inline-flex items-center gap-2 text-[#3c161e] font-medium hover:underline"
      >
        <Plus size={16} />
        Créer un lot
      </Link>
    </div>
  );
}
