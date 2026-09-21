import clsx from "clsx";
import { Layout, Save } from "lucide-react";

type HeroBannerHeaderProps = {
  embedded: boolean;
  isPending: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: () => void;
};

export function HeroBannerHeader({ embedded, isPending, message, onSave }: HeroBannerHeaderProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 border-b border-[#511f29]/10",
        embedded ? "p-4" : "bg-[#fafafa]"
      )}
      style={embedded ? undefined : { padding: "24px 40px" }}
    >
      <div className="flex items-center gap-3">
        {!embedded && (
          <div className="w-10 h-10 bg-[#511f29] text-white flex items-center justify-center rounded-lg">
            <Layout size={20} />
          </div>
        )}
        <div>
          <h2 className={clsx(embedded ? "text-lg" : "text-xl", "font-semibold text-[#000000]")}>
            {embedded ? "Configurer le Hero Banner" : "Hero Banner"}
          </h2>
          <p className="text-sm text-[#4a4a4a]">Personnalisez le banner de la page d&apos;accueil</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {message && (
          <span className={clsx("text-sm", message.type === "success" ? "text-green-600" : "text-red-600")}>
            {message.text}
          </span>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#511f29] text-white text-sm font-medium rounded-lg hover:bg-[#3d161f] disabled:opacity-50 transition-colors"
        >
          <Save size={18} />
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
