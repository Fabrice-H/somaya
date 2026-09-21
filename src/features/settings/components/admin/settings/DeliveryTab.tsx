import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { Field } from "./Field";
import { inputClass } from "./styles";
import { TabSection } from "./TabSection";

type DeliveryTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function DeliveryTab({ form, onChange }: DeliveryTabProps) {
  return (
    <TabSection title="Livraison" description="Frais et informations de livraison">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Frais de livraison (FCFA)" hint="Frais appliqués à chaque commande">
          <input
            type="number"
            value={form.delivery_fee || ""}
            onChange={(event) => onChange("delivery_fee", parseInt(event.target.value, 10) || 0)}
            min={0}
            placeholder="0"
            className={inputClass}
          />
        </Field>
        <Field label="Horaires de livraison" hint="Affiché dans le footer">
          <input
            type="text"
            value={form.delivery_hours}
            onChange={(event) => onChange("delivery_hours", event.target.value)}
            placeholder="Lun-Sam: 14h-20h"
            className={inputClass}
          />
        </Field>
      </div>
    </TabSection>
  );
}
