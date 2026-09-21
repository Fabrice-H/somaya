import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { TextField } from "./TextField";

type ContentTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function ContentTab({ form, onChange }: ContentTabProps) {
  return (
    <>
      <AdminCard title="Textes" description="Accroche, titre et description du hero.">
        <div className="grid gap-6">
          <TextField
            id="hero_eyebrow"
            label="Accroche"
            value={form.eyebrow}
            onChange={(value) => onChange("eyebrow", value)}
            placeholder="Ex. Maison de mode · Abidjan"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <TextField
              id="hero_title"
              label="Titre"
              value={form.title}
              onChange={(value) => onChange("title", value)}
              placeholder="L'élégance"
            />
            <TextField
              id="hero_title_highlight"
              label="Mot accent"
              value={form.title_highlight}
              onChange={(value) => onChange("title_highlight", value)}
              placeholder="commence"
              className="italic"
            />
            <TextField
              id="hero_title_suffix"
              label="Fin du titre"
              value={form.title_suffix}
              onChange={(value) => onChange("title_suffix", value)}
              placeholder="ici."
            />
          </div>
          <TextField
            id="hero_description"
            label="Description"
            value={form.description}
            onChange={(value) => onChange("description", value)}
            placeholder="Description du hero…"
            multiline
          />
        </div>
      </AdminCard>

      <AdminCard title="Bouton d'action">
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            id="hero_button_text"
            label="Texte du bouton"
            value={form.button_text}
            onChange={(value) => onChange("button_text", value)}
            placeholder="Découvrir la collection"
          />
          <TextField
            id="hero_button_link"
            label="Lien"
            value={form.button_link}
            onChange={(value) => onChange("button_link", value)}
            placeholder="#collections ou /catalogue"
          />
        </div>
      </AdminCard>
    </>
  );
}
