import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { HERO_COLORS } from "../../../constants";
import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { ColorField } from "./ColorField";

type StyleTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function StyleTab({ form, onChange }: StyleTabProps) {
  return (
    <AdminCard title="Couleurs" description="Palette du fond, du texte et des accents.">
      <div className="grid gap-6 md:grid-cols-2">
        <ColorField
          id="hero_background_color"
          label="Couleur de fond"
          value={form.background_color}
          fallback={HERO_COLORS.background}
          onChange={(value) => onChange("background_color", value)}
        />
        <ColorField
          id="hero_text_color"
          label="Couleur du texte"
          value={form.text_color}
          fallback={HERO_COLORS.text}
          onChange={(value) => onChange("text_color", value)}
        />
        <ColorField
          id="hero_accent_color"
          label="Couleur d'accent"
          value={form.accent_color}
          fallback={HERO_COLORS.accent}
          onChange={(value) => onChange("accent_color", value)}
          hint="Mot en surbrillance et bouton."
        />
      </div>
    </AdminCard>
  );
}
