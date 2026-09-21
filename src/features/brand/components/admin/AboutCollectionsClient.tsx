"use client";

import { useAboutCollections } from "../../hooks/useAboutCollections";
import type { AboutCollectionData } from "../../types";
import { CollectionList } from "./about-collections/CollectionList";
import { CollectionsHeader } from "./about-collections/CollectionsHeader";
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
    <div>
      <CollectionsHeader showAdd={!state.isAdding} onAdd={openForm} />
      {state.message && <StatusMessage type={state.message.type} text={state.message.text} />}

      <div style={{ padding: "32px 0" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1200 }}>
          <div className="space-y-6">
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

          <div>
            <CollectionsPreview collections={state.collections} />
            <CollectionsHelp />
          </div>
        </div>
      </div>
    </div>
  );
}
