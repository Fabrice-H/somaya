import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { Field } from "./Field";
import { HandleInput } from "./HandleInput";
import { inputClass } from "./styles";
import { TabSection } from "./TabSection";

type ContactTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function ContactTab({ form, onChange }: ContactTabProps) {
  return (
    <TabSection title="Contact & Réseaux sociaux" description="Comment vos clients peuvent vous contacter">
      <Field label="Numéro WhatsApp" hint="Format international sans le + (ex: 2250508905666)">
        <input
          type="text"
          value={form.whatsapp_number}
          onChange={(event) => onChange("whatsapp_number", event.target.value)}
          placeholder="2250508905666"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Téléphone">
          <input
            type="text"
            value={form.phone_number}
            onChange={(event) => onChange("phone_number", event.target.value)}
            placeholder="0778784268"
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="contact@somaya.ci"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Instagram">
          <HandleInput
            value={form.instagram_handle}
            onChange={(value) => onChange("instagram_handle", value)}
            placeholder="so_maya_ci"
          />
        </Field>
        <Field label="TikTok">
          <HandleInput
            value={form.tiktok_handle}
            onChange={(value) => onChange("tiktok_handle", value)}
            placeholder="somayashop"
          />
        </Field>
      </div>

      <Field label="Facebook URL">
        <input
          type="url"
          value={form.facebook_url}
          onChange={(event) => onChange("facebook_url", event.target.value)}
          placeholder="https://facebook.com/somaya.ci"
          className={inputClass}
        />
      </Field>
    </TabSection>
  );
}
