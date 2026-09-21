import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { Field } from "./Field";
import { LogoField } from "./LogoField";
import { inputClass } from "./styles";
import { TabSection } from "./TabSection";

type StoreTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function StoreTab({ form, onChange }: StoreTabProps) {
  return (
    <TabSection title="Informations de la boutique" description="Nom et identité visuelle de votre boutique">
      <Field label="Nom de la boutique *">
        <input
          type="text"
          value={form.store_name}
          onChange={(event) => onChange("store_name", event.target.value)}
          placeholder="SO'MAYA"
          className={inputClass}
        />
      </Field>
      <Field label="Slogan">
        <input
          type="text"
          value={form.tagline}
          onChange={(event) => onChange("tagline", event.target.value)}
          placeholder="La Qualité, Notre Référence"
          className={inputClass}
        />
      </Field>
      <LogoField value={form.logo_url} onChange={(url) => onChange("logo_url", url)} />
      <Field label="Adresse">
        <textarea
          value={form.address}
          onChange={(event) => onChange("address", event.target.value)}
          rows={2}
          placeholder="Angré Château, Abidjan"
          className={`${inputClass} h-auto py-3 resize-none`}
        />
      </Field>
    </TabSection>
  );
}
