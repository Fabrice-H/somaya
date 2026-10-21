import { Loader2 } from "lucide-react";

type HeroSaveActionsProps = {
  isPending: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: () => void;
};

export function HeroSaveActions({ isPending, message, onSave }: HeroSaveActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {message && (
        <p
          role="status"
          className={`m-0 text-[13px] ${
            message.type === "success"
              ? "text-[var(--som-success)]"
              : "bg-[var(--som-error-tint)] px-3 py-2 text-[var(--som-error)]"
          }`}
        >
          {message.text}
        </p>
      )}
      <button type="button" onClick={onSave} disabled={isPending} className="btn-primary">
        {isPending && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}
