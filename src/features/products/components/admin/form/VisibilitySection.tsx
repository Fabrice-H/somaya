"use client";

import { useShallow } from "zustand/react/shallow";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import type { ProductInput } from "@/features/products/types";
import { FormSection } from "./FormSection";
import { SwitchRow } from "./SwitchRow";

type Flag = "is_active" | "is_new" | "is_bestseller" | "is_featured";

const FLAGS: { key: Flag; title: string; description: string }[] = [
  {
    key: "is_active",
    title: "En ligne",
    description: "Visible dans la boutique. Désactivez pour le masquer sans le supprimer.",
  },
  { key: "is_new", title: "Nouveauté", description: "Affiche le badge « New » sur le produit." },
  { key: "is_bestseller", title: "Best-seller", description: "Apparaît dans la sélection des meilleures ventes." },
  { key: "is_featured", title: "Coup de cœur", description: "Mis en avant sur la page d'accueil." },
];

export function VisibilitySection() {
  const flags = useProductFormStore(
    useShallow((s): Pick<ProductInput, Flag> => ({
      is_active: s.form.is_active,
      is_new: s.form.is_new,
      is_bestseller: s.form.is_bestseller,
      is_featured: s.form.is_featured,
    }))
  );
  const setField = useProductFormStore((s) => s.setField);

  return (
    <FormSection step={5} title="Visibilité" description="Choisissez où et comment le produit apparaît.">
      {FLAGS.map(({ key, title, description }) => (
        <SwitchRow
          key={key}
          id={`product-${key}`}
          title={title}
          description={description}
          checked={flags[key]}
          onToggle={() => setField(key, !flags[key])}
        />
      ))}
    </FormSection>
  );
}
