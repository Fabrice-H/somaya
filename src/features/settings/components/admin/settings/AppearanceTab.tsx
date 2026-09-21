import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { TabSection } from "./TabSection";
import { ThemeColorField } from "./ThemeColorField";
import { ThemePreview } from "./ThemePreview";

type AppearanceTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function AppearanceTab({ form, onChange }: AppearanceTabProps) {
  return (
    <TabSection title="Couleurs du thème" description="Personnalisez l'apparence de votre boutique">
      <div className="grid grid-cols-2 gap-6">
        <ThemeColorField
          label="Couleur principale"
          hint="Couleur de marque principale (boutons, accents)"
          value={form.primary_color}
          onChange={(value) => onChange("primary_color", value)}
        />
        <ThemeColorField
          label="Couleur secondaire"
          hint="Couleur complémentaire (texte sur boutons)"
          value={form.secondary_color}
          onChange={(value) => onChange("secondary_color", value)}
        />
      </div>
      <ThemePreview storeName={form.store_name} primary={form.primary_color} secondary={form.secondary_color} />
    </TabSection>
  );
}
