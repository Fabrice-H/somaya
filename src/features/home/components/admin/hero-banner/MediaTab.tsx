import { ImageUpload } from "@/features/media/components/ImageUpload";
import { VideoUpload } from "@/features/media/components/VideoUpload";
import type { HeroBannerInput, HeroFieldUpdater } from "../../../types";
import { MediaTypePicker } from "./MediaTypePicker";
import { fieldClass, panelClass } from "./styles";

type MediaTabProps = {
  form: HeroBannerInput;
  onChange: HeroFieldUpdater;
};

export function MediaTab({ form, onChange }: MediaTabProps) {
  return (
    <div className="space-y-6">
      <div className={panelClass}>
        <h2 className="text-lg font-semibold text-[#000000] mb-4">Type de média</h2>
        <MediaTypePicker value={form.media_type} onChange={(value) => onChange("media_type", value)} />

        {form.media_type === "image" ? (
          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Image du hero</label>
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

      <div className={panelClass}>
        <h2 className="text-lg font-semibold text-[#000000] mb-4">Position du média</h2>
        <input
          type="text"
          value={form.media_position || ""}
          onChange={(event) => onChange("media_position", event.target.value)}
          className={fieldClass}
          placeholder="center 22%"
        />
        <p className="text-xs text-[#4a4a4a] mt-2">Position CSS (ex: center, center 20%, top left, bottom right)</p>
      </div>
    </div>
  );
}
