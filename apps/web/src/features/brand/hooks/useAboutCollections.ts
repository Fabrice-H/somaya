"use client";

import { useState, useTransition } from "react";
import {
  createAboutCollection,
  deleteAboutCollection,
  reorderAboutCollections,
  updateAboutCollection,
} from "../server/actions";
import type { AboutCollectionData, CollectionDraft, CollectionPatch } from "../types";
import { emptyCollectionDraft } from "../utils";

type Message = { type: "success" | "error"; text: string };

export function useAboutCollections(initialCollections: AboutCollectionData[]) {
  const [collections, setCollections] = useState(initialCollections);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<CollectionDraft>(emptyCollectionDraft);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [, startTransition] = useTransition();

  const patchLocal = (id: string, patch: CollectionPatch) =>
    setCollections((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const add = () => {
    if (!draft.name.trim()) return;
    setSaving("new");
    setMessage(null);
    startTransition(async () => {
      const sortOrder = collections.length;
      const result = await createAboutCollection({ ...draft, isActive: true, sortOrder });
      if (result.success && result.id) {
        setCollections((prev) => [...prev, { ...draft, id: result.id!, isActive: true, sortOrder }]);
        setDraft(emptyCollectionDraft());
        setIsAdding(false);
        setMessage({ type: "success", text: "Collection ajoutée avec succès" });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur lors de l'ajout" });
      }
      setSaving(null);
    });
  };

  const save = async (id: string, patch: CollectionPatch) => {
    patchLocal(id, patch);
    setSaving(id);
    setMessage(null);
    const result = await updateAboutCollection(id, patch);
    if (!result.success) setMessage({ type: "error", text: result.error || "Erreur lors de la mise à jour" });
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette collection ?")) return;
    setSaving(id);
    setMessage(null);
    const result = await deleteAboutCollection(id);
    if (result.success) {
      setCollections((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Collection supprimée" });
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la suppression" });
    }
    setSaving(null);
  };

  const move = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= collections.length) return;
    const next = [...collections];
    [next[index], next[target]] = [next[target], next[index]];
    setCollections(next);
    const result = await reorderAboutCollections(next.map((item) => item.id));
    if (!result.success) setMessage({ type: "error", text: result.error || "Erreur lors du réordonnancement" });
  };

  return {
    collections,
    isAdding,
    setIsAdding,
    draft,
    setDraft,
    saving,
    message,
    add,
    patchLocal,
    save,
    remove,
    move,
  };
}
