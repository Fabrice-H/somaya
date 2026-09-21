import { Plus, Users } from "lucide-react";
import { primaryButtonClass } from "./styles";

type CollectionsHeaderProps = {
  showAdd: boolean;
  onAdd: () => void;
};

export function CollectionsHeader({ showAdd, onAdd }: CollectionsHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap bg-[#fafafa] border-b border-[#511f29]/10"
      style={{ padding: "24px 40px", margin: "-24px -24px 0 -24px" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-[#511f29] text-white">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#000000]">Collections À propos</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">Section affichée sur la page &quot;Notre Histoire&quot;</p>
        </div>
      </div>

      {showAdd && (
        <button type="button" onClick={onAdd} className={`${primaryButtonClass} h-11 px-6`}>
          <Plus size={16} />
          Ajouter
        </button>
      )}
    </div>
  );
}
