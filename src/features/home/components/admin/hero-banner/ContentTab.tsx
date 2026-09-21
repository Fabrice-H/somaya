import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { panelClass } from "./styles";
import { TextField } from "./TextField";

type ContentTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function ContentTab({ form, onChange }: ContentTabProps) {
  return (
    <div className="space-y-6">
      <div className={panelClass}>
        <h2 className="text-lg font-semibold text-[#000000] mb-4">Textes du hero</h2>
        <div className="space-y-4">
          <TextField
            label="Accroche"
            value={form.eyebrow}
            onChange={(value) => onChange("eyebrow", value)}
            placeholder="Ex: Maison de mode · Abidjan"
          />
          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Titre"
              value={form.title}
              onChange={(value) => onChange("title", value)}
              placeholder="L'élégance"
            />
            <TextField
              label="Mot accent"
              value={form.title_highlight}
              onChange={(value) => onChange("title_highlight", value)}
              placeholder="commence"
              className="italic"
            />
            <TextField
              label="Fin"
              value={form.title_suffix}
              onChange={(value) => onChange("title_suffix", value)}
              placeholder="ici."
            />
          </div>
          <TextField
            label="Description"
            value={form.description}
            onChange={(value) => onChange("description", value)}
            placeholder="Description du hero..."
            multiline
          />
        </div>
      </div>

      <div className={panelClass}>
        <h2 className="text-lg font-semibold text-[#000000] mb-4">Bouton d&apos;action</h2>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Texte du bouton"
            value={form.button_text}
            onChange={(value) => onChange("button_text", value)}
            placeholder="Découvrir la collection"
          />
          <TextField
            label="Lien"
            value={form.button_link}
            onChange={(value) => onChange("button_link", value)}
            placeholder="#collections ou /catalogue"
          />
        </div>
      </div>
    </div>
  );
}
