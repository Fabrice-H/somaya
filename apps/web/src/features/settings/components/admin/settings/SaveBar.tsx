import { Check, Loader2, TriangleAlert } from "lucide-react";

type SaveBarProps = {
  isPending: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: () => void;
};

export function SaveBar({ isPending, message, onSave }: SaveBarProps) {
  const success = message?.type === "success";
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center justify-end gap-x-6 gap-y-3 border border-[var(--som-border)] bg-white px-5 py-4 lg:px-6">
      {message && (
        <p
          role="status"
          className={`m-0 mr-auto flex items-center gap-2 text-[13px] ${
            success ? "text-[var(--som-success)]" : "bg-[var(--som-error-tint)] px-3 py-2 text-[var(--som-error)]"
          }`}
        >
          {success ? (
            <Check size={15} strokeWidth={1.5} aria-hidden />
          ) : (
            <TriangleAlert size={15} strokeWidth={1.5} aria-hidden />
          )}
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
