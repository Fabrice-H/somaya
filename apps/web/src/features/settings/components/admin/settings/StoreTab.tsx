import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { LogoField } from "./LogoField";

type StoreTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function StoreTab({ form, onChange }: StoreTabProps) {
  return (
    <div className="space-y-6">
      <AdminCard title="Identité" description="Nom, slogan et logo affichés sur la boutique.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field id="store_name" label="Nom de la boutique" required>
            <input
              id="store_name"
              type="text"
              value={form.store_name}
              onChange={(event) => onChange("store_name", event.target.value)}
              placeholder="SO'MAYA"
              className="input-som"
            />
          </Field>
          <Field id="tagline" label="Slogan">
            <input
              id="tagline"
              type="text"
              value={form.tagline}
              onChange={(event) => onChange("tagline", event.target.value)}
              placeholder="La Qualité, Notre Référence"
              className="input-som"
            />
          </Field>
          <div className="md:col-span-2">
            <LogoField value={form.logo_url} onChange={(url) => onChange("logo_url", url)} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Adresse" description="Affichée dans le pied de page et la page contact.">
        <Field id="address" label="Adresse de la boutique">
          <textarea
            id="address"
            value={form.address}
            onChange={(event) => onChange("address", event.target.value)}
            rows={2}
            placeholder="Angré Château, Abidjan"
            className="input-som"
          />
        </Field>
      </AdminCard>
    </div>
  );
}
