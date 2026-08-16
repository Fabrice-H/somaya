"use client";

import { useState, useTransition, useRef } from "react";
import { Save, Layout, Type, Image as ImageIcon, Film, Palette, Eye, Upload, Link as LinkIcon, Loader2, X, Play } from "lucide-react";
import { updateHeroBanner, type HeroBannerData } from "./actions";
import { ImageUpload } from "../components/ImageUpload";
import { uploadVideo } from "../storage/actions";
import clsx from "clsx";

interface HeroBannerFormProps {
  data: HeroBannerData | null;
  embedded?: boolean;
}

const TABS = [
  { id: "layout", label: "Disposition", icon: Layout },
  { id: "content", label: "Contenu", icon: Type },
  { id: "media", label: "Média", icon: ImageIcon },
  { id: "style", label: "Style", icon: Palette },
];

const LAYOUTS = [
  {
    value: "split",
    label: "Split",
    description: "Texte à gauche, média à droite",
    preview: (
      <div className="flex h-12 gap-1">
        <div className="flex-1 bg-[#511F29] rounded-sm flex items-center justify-center">
          <div className="w-6 h-1 bg-[#fcd3b4] rounded" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-sm" />
      </div>
    )
  },
  {
    value: "centered",
    label: "Centré",
    description: "Texte centré sur le média",
    preview: (
      <div className="h-12 bg-gray-200 rounded-sm relative">
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-8 h-1 bg-white rounded" />
        </div>
      </div>
    )
  },
  {
    value: "fullwidth",
    label: "Plein écran",
    description: "Média avec texte en bas",
    preview: (
      <div className="h-12 bg-gray-200 rounded-sm relative">
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/60 to-transparent flex items-end pb-1 pl-2">
          <div className="w-6 h-0.5 bg-white rounded" />
        </div>
      </div>
    )
  },
];

// ============================================================
// Video Upload Section Component
// ============================================================

type VideoInputMode = "upload" | "url";

function VideoUploadSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<VideoInputMode>(
    value && (value.startsWith("http") || value.startsWith("/")) ? "url" : "upload"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "store");

      const result = await uploadVideo(formData);

      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    } catch (error) {
      setUploadError("Erreur lors de l'upload");
      console.error("Video upload error:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check if it's a video
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setUploadError("Veuillez déposer une vidéo (MP4, MOV, WebM)");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "store");

      const result = await uploadVideo(formData);

      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    } catch (error) {
      setUploadError("Erreur lors de l'upload");
      console.error("Video upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearVideo = () => {
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            mode === "upload"
              ? "bg-[#511F29] text-[#fcd3b4]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Upload size={16} />
          Uploader
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            mode === "url"
              ? "bg-[#511F29] text-[#fcd3b4]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <LinkIcon size={16} />
          URL / Lien
        </button>
      </div>

      {mode === "upload" ? (
        <div>
          {/* Current Video Preview */}
          {value && (
            <div className="mb-4 relative rounded-lg overflow-hidden bg-black">
              <video
                src={value}
                className="w-full h-48 object-cover"
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play size={48} className="text-white" />
              </div>
              <button
                type="button"
                onClick={clearVideo}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={clsx(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
              isUploading
                ? "border-[#511F29] bg-[#511F29]/5"
                : "border-gray-200 hover:border-[#511F29]/50 hover:bg-[#511F29]/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-[#511F29] animate-spin" />
                <p className="text-[#511F29] font-medium">Upload en cours...</p>
                <p className="text-xs text-gray-500">Cela peut prendre quelques instants</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#511F29]/10 flex items-center justify-center">
                  <Film size={24} className="text-[#511F29]" />
                </div>
                <div>
                  <p className="font-medium text-[#2a181d]">
                    Glissez une vidéo ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    MP4, MOV, WebM · Max 100 MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-red-600 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
            URL de la vidéo
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
            placeholder="https://... ou /video.mp4"
          />
          <p className="text-xs text-[#6e5a50] mt-2">
            URL Cloudinary, chemin local (/video.mp4), ou lien externe
          </p>

          {/* Preview for URL mode */}
          {value && (
            <div className="mt-4 relative rounded-lg overflow-hidden bg-black">
              <video
                src={value}
                className="w-full h-48 object-cover"
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play size={48} className="text-white" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Form Component
// ============================================================

export function HeroBannerForm({ data, embedded = false }: HeroBannerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("layout");

  const [form, setForm] = useState<Omit<HeroBannerData, "id">>({
    layout: data?.layout || "split",
    eyebrow: data?.eyebrow || "Maison de mode · Abidjan",
    title: data?.title || "L'élégance",
    title_highlight: data?.title_highlight || "commence",
    title_suffix: data?.title_suffix || "ici.",
    description: data?.description || "Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.",
    button_text: data?.button_text || "Découvrir la collection",
    button_link: data?.button_link || "#collections",
    media_type: data?.media_type || "video",
    media_url: data?.media_url || "",
    media_position: data?.media_position || "center center",
    background_color: data?.background_color || "#511F29",
    text_color: data?.text_color || "#fbf3ec",
    accent_color: data?.accent_color || "#fcd3b4",
    is_active: data?.is_active ?? true,
  });

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await updateHeroBanner(form);
      if (result.success) {
        setMessage({ type: "success", text: "Hero banner mis à jour avec succès" });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur lors de la mise à jour" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  return (
    <div>
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between gap-4",
          embedded ? "p-4 border-b border-[#511F29]/10" : "bg-[#faf6f1] border-b border-[#511F29]/10"
        )}
        style={embedded ? {} : { padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          {!embedded && (
            <div className="w-10 h-10 bg-[#511F29] text-white flex items-center justify-center rounded-lg">
              <Layout size={20} />
            </div>
          )}
          <div>
            <h2 className={clsx(embedded ? "text-lg" : "text-xl", "font-semibold text-[#2a181d]")}>
              {embedded ? "Configurer le Hero Banner" : "Hero Banner"}
            </h2>
            <p className="text-sm text-[#6e5a50]">Personnalisez le banner de la page d&apos;accueil</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#511F29] text-white text-sm font-medium rounded-lg
                     hover:bg-[#3d161f] disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Content with Tabs */}
      <div style={{ padding: embedded ? "16px" : "32px 40px" }}>
        <div className="flex gap-8" style={{ maxWidth: 1200 }}>
          {/* Left: Tabs Navigation */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-[#511F29] text-white"
                      : "text-[#511F29]/70 hover:bg-[#511F29]/5"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Active Toggle */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-[#511F29]/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="w-5 h-5 rounded border-[#511F29]/20 text-[#511F29] focus:ring-[#511F29]/20"
                />
                <div>
                  <span className="font-medium text-sm text-[#2a181d]">Actif</span>
                  <p className="text-xs text-[#6e5a50]">Afficher sur le site</p>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Tab Content */}
          <div className="flex-1">
            {/* Tab: Layout */}
            {activeTab === "layout" && (
              <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                <h2 className="text-lg font-semibold text-[#2a181d] mb-2">Choisir la disposition</h2>
                <p className="text-sm text-[#6e5a50] mb-6">Sélectionnez comment le contenu sera affiché sur le hero banner</p>

                <div className="grid grid-cols-3 gap-4">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.value}
                      type="button"
                      onClick={() => updateField("layout", layout.value)}
                      className={clsx(
                        "p-4 border-2 rounded-xl text-left transition-all",
                        form.layout === layout.value
                          ? "border-[#511F29] bg-[#511F29]/5 ring-2 ring-[#511F29]/20"
                          : "border-gray-200 hover:border-[#511F29]/30"
                      )}
                    >
                      <div className="mb-3">{layout.preview}</div>
                      <div className="font-semibold text-[#2a181d]">{layout.label}</div>
                      <div className="text-xs text-[#6e5a50] mt-1">{layout.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Content */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                  <h2 className="text-lg font-semibold text-[#2a181d] mb-4">Textes du hero</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                        Accroche
                      </label>
                      <input
                        type="text"
                        value={form.eyebrow || ""}
                        onChange={(e) => updateField("eyebrow", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                        placeholder="Ex: Maison de mode · Abidjan"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                          Titre
                        </label>
                        <input
                          type="text"
                          value={form.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                          placeholder="L'élégance"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                          Mot accent
                        </label>
                        <input
                          type="text"
                          value={form.title_highlight || ""}
                          onChange={(e) => updateField("title_highlight", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29] italic"
                          placeholder="commence"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                          Fin
                        </label>
                        <input
                          type="text"
                          value={form.title_suffix || ""}
                          onChange={(e) => updateField("title_suffix", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                          placeholder="ici."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={form.description || ""}
                        onChange={(e) => updateField("description", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29] resize-none"
                        placeholder="Description du hero..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                  <h2 className="text-lg font-semibold text-[#2a181d] mb-4">Bouton d&apos;action</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                        Texte du bouton
                      </label>
                      <input
                        type="text"
                        value={form.button_text || ""}
                        onChange={(e) => updateField("button_text", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                        placeholder="Découvrir la collection"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                        Lien
                      </label>
                      <input
                        type="text"
                        value={form.button_link || ""}
                        onChange={(e) => updateField("button_link", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                        placeholder="#collections ou /catalogue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Media */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                  <h2 className="text-lg font-semibold text-[#2a181d] mb-4">Type de média</h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => updateField("media_type", "image")}
                      className={clsx(
                        "flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all",
                        form.media_type === "image"
                          ? "border-[#511F29] bg-[#511F29]/5"
                          : "border-gray-200 hover:border-[#511F29]/30"
                      )}
                    >
                      <ImageIcon size={24} className={form.media_type === "image" ? "text-[#511F29]" : "text-gray-400"} />
                      <span className={clsx("font-medium", form.media_type === "image" ? "text-[#511F29]" : "text-gray-600")}>
                        Image
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("media_type", "video")}
                      className={clsx(
                        "flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all",
                        form.media_type === "video"
                          ? "border-[#511F29] bg-[#511F29]/5"
                          : "border-gray-200 hover:border-[#511F29]/30"
                      )}
                    >
                      <Film size={24} className={form.media_type === "video" ? "text-[#511F29]" : "text-gray-400"} />
                      <span className={clsx("font-medium", form.media_type === "video" ? "text-[#511F29]" : "text-gray-600")}>
                        Vidéo
                      </span>
                    </button>
                  </div>

                  {form.media_type === "image" ? (
                    <div>
                      <label className="block text-sm font-medium text-[#2a181d] mb-2">
                        Image du hero
                      </label>
                      <ImageUpload
                        images={form.media_url ? [form.media_url] : []}
                        onChange={(urls) => updateField("media_url", urls[0] || "")}
                        bucket="store"
                        maxImages={1}
                      />
                    </div>
                  ) : (
                    <VideoUploadSection
                      value={form.media_url || ""}
                      onChange={(url) => updateField("media_url", url)}
                    />
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                  <h2 className="text-lg font-semibold text-[#2a181d] mb-4">Position du média</h2>
                  <input
                    type="text"
                    value={form.media_position || ""}
                    onChange={(e) => updateField("media_position", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29]"
                    placeholder="center 22%"
                  />
                  <p className="text-xs text-[#6e5a50] mt-2">
                    Position CSS (ex: center, center 20%, top left, bottom right)
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Style */}
            {activeTab === "style" && (
              <div className="bg-white p-6 rounded-lg border border-[#511F29]/10">
                <h2 className="text-lg font-semibold text-[#2a181d] mb-4">Couleurs</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2a181d] mb-3">
                      Couleur de fond
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={form.background_color || "#511F29"}
                        onChange={(e) => updateField("background_color", e.target.value)}
                        className="w-16 h-12 cursor-pointer border-2 border-gray-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={form.background_color || ""}
                        onChange={(e) => updateField("background_color", e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29] font-mono"
                        placeholder="#511F29"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a181d] mb-3">
                      Couleur du texte
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={form.text_color || "#fbf3ec"}
                        onChange={(e) => updateField("text_color", e.target.value)}
                        className="w-16 h-12 cursor-pointer border-2 border-gray-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={form.text_color || ""}
                        onChange={(e) => updateField("text_color", e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29] font-mono"
                        placeholder="#fbf3ec"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a181d] mb-3">
                      Couleur d&apos;accent
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={form.accent_color || "#fcd3b4"}
                        onChange={(e) => updateField("accent_color", e.target.value)}
                        className="w-16 h-12 cursor-pointer border-2 border-gray-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={form.accent_color || ""}
                        onChange={(e) => updateField("accent_color", e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 focus:border-[#511F29] font-mono"
                        placeholder="#fcd3b4"
                      />
                    </div>
                    <p className="text-xs text-[#6e5a50] mt-2">
                      Utilisé pour le mot en surbrillance et le bouton
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Section - Always visible */}
            <div className="mt-6 bg-white p-6 rounded-lg border border-[#511F29]/10">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-[#511F29]" />
                <h2 className="text-lg font-semibold text-[#2a181d]">Aperçu</h2>
              </div>

              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  height: 280,
                  backgroundColor: form.background_color || "#511F29",
                }}
              >
                {form.layout === "split" ? (
                  <div className="grid grid-cols-2 h-full">
                    <div className="p-6 flex flex-col justify-center">
                      <div
                        className="text-[10px] uppercase tracking-wider mb-2 opacity-80"
                        style={{ color: form.accent_color || "#fcd3b4" }}
                      >
                        {form.eyebrow}
                      </div>
                      <h3
                        className="text-2xl font-serif leading-tight"
                        style={{ color: form.text_color || "#fbf3ec" }}
                      >
                        {form.title}
                        {form.title_highlight && (
                          <>
                            <br />
                            <em style={{ fontStyle: "italic", color: form.accent_color || "#fcd3b4" }}>{form.title_highlight}</em>
                          </>
                        )}
                        {form.title_suffix && (
                          <>
                            <br />
                            {form.title_suffix}
                          </>
                        )}
                      </h3>
                      <p
                        className="text-xs mt-3 opacity-70 line-clamp-2"
                        style={{ color: form.text_color || "#fbf3ec" }}
                      >
                        {form.description}
                      </p>
                      <div
                        className="mt-4 inline-block px-4 py-2 text-[10px] font-semibold uppercase tracking-wider rounded"
                        style={{ backgroundColor: form.accent_color || "#fcd3b4", color: form.background_color || "#511F29" }}
                      >
                        {form.button_text}
                      </div>
                    </div>
                    <div className="bg-gray-300 relative">
                      {form.media_url && form.media_type === "image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.media_url}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ objectPosition: form.media_position || "center" }}
                        />
                      )}
                      {form.media_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-400/50">
                          <Film size={40} className="text-white/70" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : form.layout === "centered" ? (
                  <div className="relative h-full">
                    {form.media_url && form.media_type === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.media_url}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: form.media_position || "center" }}
                      />
                    )}
                    {form.media_type === "video" && (
                      <div className="absolute inset-0 bg-gray-400/50" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                      <div
                        className="text-[10px] uppercase tracking-wider mb-2"
                        style={{ color: form.accent_color || "#fcd3b4" }}
                      >
                        {form.eyebrow}
                      </div>
                      <h3
                        className="text-3xl font-serif"
                        style={{ color: form.text_color || "#fbf3ec" }}
                      >
                        {form.title}
                      </h3>
                      <p
                        className="text-lg font-serif italic mt-1"
                        style={{ color: form.accent_color || "#fcd3b4" }}
                      >
                        {form.title_highlight} {form.title_suffix}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full">
                    {form.media_url && form.media_type === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.media_url}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: form.media_position || "center" }}
                      />
                    )}
                    {form.media_type === "video" && (
                      <div className="absolute inset-0 bg-gray-400/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div
                        className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: form.accent_color || "#fcd3b4" }}
                      >
                        {form.eyebrow}
                      </div>
                      <h3
                        className="text-xl font-serif"
                        style={{ color: form.text_color || "#fbf3ec" }}
                      >
                        {form.title}{" "}
                        <em style={{ color: form.accent_color || "#fcd3b4" }}>{form.title_highlight}</em>{" "}
                        {form.title_suffix}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
