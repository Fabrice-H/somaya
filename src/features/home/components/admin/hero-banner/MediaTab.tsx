import { ImageUpload } from "@/features/media/components/ImageUpload";
import { VideoUpload } from "@/features/media/components/VideoUpload";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { MediaTypePicker } from "./MediaTypePicker";
import { TextField } from "./TextField";

type MediaTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function MediaTab({ form, onChange }: MediaTabProps) {
  return (
    <>
      <AdminCard title="Média" description="Image ou vidéo affichée à côté du texte.">
        <div className="space-y-6">
          <MediaTypePicker value={form.media_type} onChange={(value) => onChange("media_type", value)} />
          {form.media_type === "image" ? (
            <div>
              <p className="label-som m-0">Image du hero</p>
              <ImageUpload
                images={form.media_url ? [form.media_url] : []}
                onChange={(urls) => onChange("media_url", urls[0] || "")}
                bucket="store"
                maxImages={1}
              />
            </div>
          ) : (
            <VideoUpload value={form.media_url || ""} onChange={(url) => onChange("media_url", url)} />
          )}
        </div>
      </AdminCard>

      <AdminCard title="Cadrage">
        <TextField
          id="hero_media_position"
          label="Position du média"
          value={form.media_position}
          onChange={(value) => onChange("media_position", value)}
          placeholder="center 22%"
          hint="Position CSS, ex. center, center 20%, top left, bottom right."
        />
      </AdminCard>
    </>
  );
}
