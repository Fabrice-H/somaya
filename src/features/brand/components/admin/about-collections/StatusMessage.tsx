import { Check, TriangleAlert } from "lucide-react";

type StatusMessageProps = {
  type: "success" | "error";
  text: string;
};

export function StatusMessage({ type, text }: StatusMessageProps) {
  const success = type === "success";
  return (
    <p
      role="status"
      className={`m-0 mb-6 flex items-center gap-2 text-[13px] ${
        success ? "text-[var(--som-success)]" : "bg-[var(--som-error-tint)] px-4 py-3 text-[var(--som-error)]"
      }`}
    >
      {success ? (
        <Check size={15} strokeWidth={1.5} aria-hidden />
      ) : (
        <TriangleAlert size={15} strokeWidth={1.5} aria-hidden />
      )}
      {text}
    </p>
  );
}
