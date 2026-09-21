import { Plus, Users } from "lucide-react";
import type { AboutCollectionData, CollectionPatch } from "../../../types";
import { CollectionRow } from "./CollectionRow";
import { cardStyle, primaryButtonClass } from "./styles";

type CollectionListProps = {
  collections: AboutCollectionData[];
  saving: string | null;
  showCreate: boolean;
  onCreate: () => void;
  onEdit: (id: string, patch: CollectionPatch) => void;
  onSave: (id: string, patch: CollectionPatch) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
};

export function CollectionList({
  collections,
  saving,
  showCreate,
  onCreate,
  onEdit,
  onSave,
  onMove,
  onDelete,
}: CollectionListProps) {
  return (
    <div className="bg-white" style={cardStyle}>
      <h2 className="text-base font-semibold text-[#000000] mb-4">Vos collections ({collections.length})</h2>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#fafafa] flex items-center justify-center">
            <Users size={24} className="text-[#6b6b6b]" />
          </div>
          <p className="text-[#6b6b6b] text-sm mb-4">Aucune collection configurée</p>
          {showCreate && (
            <button type="button" onClick={onCreate} className={`${primaryButtonClass} h-10 px-5`}>
              <Plus size={14} />
              Créer une collection
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map((collection, index) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              isFirst={index === 0}
              isLast={index === collections.length - 1}
              saving={saving === collection.id}
              onEdit={(patch) => onEdit(collection.id, patch)}
              onSave={(patch) => onSave(collection.id, patch)}
              onMove={(direction) => onMove(index, direction)}
              onDelete={() => onDelete(collection.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
