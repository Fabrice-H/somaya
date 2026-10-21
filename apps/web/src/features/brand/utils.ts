import type { AboutCollection } from "@/shared/lib/db/schema";
import { DEFAULT_COLLECTION_COLOR } from "./constants";
import type { AboutCollectionData, CollectionDraft } from "./types";

export function toAboutCollectionData(row: AboutCollection): AboutCollectionData {
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    backgroundColor: row.backgroundColor || DEFAULT_COLLECTION_COLOR,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export function emptyCollectionDraft(): CollectionDraft {
  return { name: "", year: String(new Date().getFullYear()), backgroundColor: DEFAULT_COLLECTION_COLOR };
}
