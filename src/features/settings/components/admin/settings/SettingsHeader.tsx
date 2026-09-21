import { Loader2, Save } from "lucide-react";

type SettingsHeaderProps = {
  showSave: boolean;
  isPending: boolean;
  onSave: () => void;
};

export function SettingsHeader({ showSave, isPending, onSave }: SettingsHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap bg-[#fafafa] border-b border-[#511f29]/10"
      style={{ padding: "24px 40px" }}
    >
      <div>
        <h1 className="text-xl font-semibold text-[#000000]">Réglages</h1>
        <p className="text-sm text-[#6b6b6b] mt-0.5">Configurez les paramètres de votre boutique</p>
      </div>

      {showSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#511f29] text-white text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      )}
    </div>
  );
}
