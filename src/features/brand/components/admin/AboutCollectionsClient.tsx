"use client";

import { Plus } from "lucide-react";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { useAboutCollections } from "../../hooks/useAboutCollections";
import type { AboutCollectionData } from "../../types";
import { CollectionList } from "./about-collections/CollectionList";
import { CollectionsHelp } from "./about-collections/CollectionsHelp";
import { CollectionsPreview } from "./about-collections/CollectionsPreview";
import { NewCollectionForm } from "./about-collections/NewCollectionForm";
import { StatusMessage } from "./about-collections/StatusMessage";

type AboutCollectionsClientProps = {
  initialCollections: AboutCollectionData[];
};

export function AboutCollectionsClient({ initialCollections }: AboutCollectionsClientProps) {
  const state = useAboutCollections(initialCollections);
  const openForm = () => state.setIsAdding(true);

  return (
    <AdminPage
      eyebrow="Notre histoire"
      title="Collections À propos"
      description="Section affichée sur la page « Notre Histoire »."
      actions={
        !state.isAdding && (
          <button type="button" onClick={openForm} className="btn-primary">
            <Plus size={16} strokeWidth={1.5} aria-hidden />
            Ajouter
          </button>
        )
      }
    >
      {state.message && <StatusMessage type={state.message.type} text={state.message.text} />}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {state.isAdding && (
            <NewCollectionForm
              draft={state.draft}
              saving={state.saving === "new"}
              onChange={state.setDraft}
              onSubmit={state.add}
              onCancel={() => state.setIsAdding(false)}
            />
          )}
          <CollectionList
            collections={state.collections}
            saving={state.saving}
            showCreate={!state.isAdding}
            onCreate={openForm}
            onEdit={state.patchLocal}
            onSave={state.save}
            onMove={state.move}
            onDelete={state.remove}
          />
        </div>

        <div className="space-y-6">
          <CollectionsPreview collections={state.collections} />
          <CollectionsHelp />
        </div>
      </div>
    </AdminPage>
  );
}
