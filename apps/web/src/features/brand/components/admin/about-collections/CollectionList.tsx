import { Layers, Plus } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import type { AboutCollectionData, CollectionPatch } from "../../../types";
import { CollectionRow } from "./CollectionRow";

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
    <AdminCard
      title="Vos collections"
      padded={false}
      action={<span className="text-[12px] tabular-nums text-[var(--som-gray)]">{collections.length}</span>}
    >
      {collections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Aucune collection configurée"
          description="Ajoutez votre première collection pour l'afficher sur « Notre Histoire »."
          action={
            showCreate && (
              <button type="button" onClick={onCreate} className="btn-primary btn-sm">
                <Plus size={15} strokeWidth={1.5} aria-hidden />
                Créer une collection
              </button>
            )
          }
        />
      ) : (
        <ul className="m-0 list-none p-0">
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
        </ul>
      )}
    </AdminCard>
  );
}
