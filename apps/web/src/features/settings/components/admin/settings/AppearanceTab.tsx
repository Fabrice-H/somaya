import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { ThemeColorField } from "./ThemeColorField";
import { ThemePreview } from "./ThemePreview";

type AppearanceTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function AppearanceTab({ form, onChange }: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      <AdminCard title="Couleurs du thème" description="Personnalisez l'apparence de votre boutique.">
        <div className="grid gap-6 md:grid-cols-2">
          <ThemeColorField
            id="primary_color"
            label="Couleur principale"
            hint="Couleur de marque : boutons et accents."
            value={form.primary_color}
            onChange={(value) => onChange("primary_color", value)}
          />
          <ThemeColorField
            id="secondary_color"
            label="Couleur secondaire"
            hint="Couleur complémentaire : texte sur les boutons."
            value={form.secondary_color}
            onChange={(value) => onChange("secondary_color", value)}
          />
        </div>
      </AdminCard>
      <AdminCard title="Aperçu">
        <ThemePreview storeName={form.store_name} primary={form.primary_color} secondary={form.secondary_color} />
      </AdminCard>
    </div>
  );
}
