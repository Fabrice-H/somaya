import { Phone } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import type { SettingsFieldUpdater, SettingsInput } from "../../../types";
import { HandleInput } from "./HandleInput";

type ContactTabProps = {
  form: SettingsInput;
  onChange: SettingsFieldUpdater;
};

export function ContactTab({ form, onChange }: ContactTabProps) {
  return (
    <div className="space-y-6">
      <AdminCard title="Contact" description="Comment vos clientes peuvent vous joindre.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field
              id="whatsapp_number"
              label="Numéro WhatsApp"
              hint="Format international sans le +, ex. 2250508905666"
            >
              <div className="input-group-som">
                <span aria-hidden>+</span>
                <input
                  id="whatsapp_number"
                  type="text"
                  inputMode="numeric"
                  value={form.whatsapp_number}
                  onChange={(event) => onChange("whatsapp_number", event.target.value)}
                  placeholder="2250508905666"
                  className="input-som"
                />
              </div>
            </Field>
          </div>
          <Field id="phone_number" label="Téléphone">
            <div className="input-group-som">
              <span aria-hidden>
                <Phone size={15} strokeWidth={1.5} />
              </span>
              <input
                id="phone_number"
                type="text"
                inputMode="tel"
                value={form.phone_number}
                onChange={(event) => onChange("phone_number", event.target.value)}
                placeholder="0778784268"
                className="input-som"
              />
            </div>
          </Field>
          <Field id="email" label="E-mail">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="contact@somaya.ci"
              className="input-som"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Réseaux sociaux" description="Liens affichés dans l'en-tête et le pied de page.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field id="instagram_handle" label="Instagram">
            <HandleInput
              id="instagram_handle"
              value={form.instagram_handle}
              onChange={(value) => onChange("instagram_handle", value)}
              placeholder="so_maya_ci"
            />
          </Field>
          <Field id="tiktok_handle" label="TikTok">
            <HandleInput
              id="tiktok_handle"
              value={form.tiktok_handle}
              onChange={(value) => onChange("tiktok_handle", value)}
              placeholder="somayashop"
            />
          </Field>
          <div className="md:col-span-2">
            <Field id="facebook_url" label="Page Facebook">
              <input
                id="facebook_url"
                type="url"
                value={form.facebook_url}
                onChange={(event) => onChange("facebook_url", event.target.value)}
                placeholder="https://facebook.com/somaya.ci"
                className="input-som"
              />
            </Field>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
