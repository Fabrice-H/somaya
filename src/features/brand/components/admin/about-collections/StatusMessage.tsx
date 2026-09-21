import { Check, X } from "lucide-react";

type StatusMessageProps = {
  type: "success" | "error";
  text: string;
};

export function StatusMessage({ type, text }: StatusMessageProps) {
  const success = type === "success";
  return (
    <div
      style={{
        padding: 16,
        marginTop: 24,
        background: success ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
        border: `1px solid ${success ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
        color: success ? "#15803d" : "#dc2626",
      }}
    >
      <div className="flex items-center gap-2 text-sm">
        {success ? <Check size={16} /> : <X size={16} />}
        {text}
      </div>
    </div>
  );
}
