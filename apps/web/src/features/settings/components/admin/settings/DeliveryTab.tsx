import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import type { SettingsFieldUpdater, SettingsInput } from "../../../types";

type DeliveryTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function DeliveryTab({ form, onChange }: DeliveryTabProps) {
  return (
    <AdminCard title="Livraison" description="Frais et créneaux communiqués à vos clientes.">
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="delivery_fee" label="Frais de livraison (FCFA)" hint="Appliqués à chaque commande.">
          <input
            id="delivery_fee"
            type="number"
            inputMode="numeric"
            value={form.delivery_fee || ""}
            onChange={(event) => onChange("delivery_fee", parseInt(event.target.value, 10) || 0)}
            min={0}
            placeholder="0"
            className="input-som tabular-nums"
          />
        </Field>
        <Field id="delivery_hours" label="Horaires de livraison" hint="Affichés dans le pied de page.">
          <input
            id="delivery_hours"
            type="text"
            value={form.delivery_hours}
            onChange={(event) => onChange("delivery_hours", event.target.value)}
            placeholder="Lun-Sam : 14h-20h"
            className="input-som"
          />
        </Field>
      </div>
    </AdminCard>
  );
}
