import { HERO_COLORS } from "../../../constants";
import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { ColorField } from "./ColorField";
import { panelClass } from "./styles";

type StyleTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function StyleTab({ form, onChange }: StyleTabProps) {
  return (
    <div className={panelClass}>
      <h2 className="text-lg font-semibold text-[#000000] mb-4">Couleurs</h2>
      <div className="space-y-6">
        <ColorField
          label="Couleur de fond"
          value={form.background_color}
          fallback={HERO_COLORS.background}
          onChange={(value) => onChange("background_color", value)}
        />
        <ColorField
          label="Couleur du texte"
          value={form.text_color}
          fallback={HERO_COLORS.text}
          onChange={(value) => onChange("text_color", value)}
        />
        <ColorField
          label="Couleur d'accent"
          value={form.accent_color}
          fallback={HERO_COLORS.accent}
          onChange={(value) => onChange("accent_color", value)}
          hint="Utilisé pour le mot en surbrillance et le bouton"
        />
      </div>
    </div>
  );
}
