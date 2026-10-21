export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-[var(--som-surface)] text-[#4a4a4a]",
  primary: "bg-[var(--som-primary-50)] text-[var(--som-primary)]",
  success: "bg-[#e8f3ec] text-[#1f6b3f]",
  warning: "bg-[#fbf1e3] text-[#8a5a14]",
  danger: "bg-[#fbeaea] text-[#a52a2a]",
  info: "bg-[#eaf0f8] text-[#2c4f7c]",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.12em] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
