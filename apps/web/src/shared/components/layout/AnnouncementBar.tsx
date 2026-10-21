import { ANNOUNCEMENTS } from "@/shared/config/navigation";

function Messages({ hidden = false }: { hidden?: boolean }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className="inline-flex items-center py-[9px] text-[11.5px] uppercase tracking-[0.22em]"
    >
      {ANNOUNCEMENTS.map((message) => (
        <span key={message} className="inline-flex items-center">
          <span className="px-[30px]">{message}</span>
          <span aria-hidden className="opacity-45">
            ✦
          </span>
        </span>
      ))}
    </span>
  );
}

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-[var(--som-primary)] text-white/90">
      <div className="animate-marquee inline-flex items-center will-change-transform motion-reduce:animate-none">
        <Messages />
        <Messages hidden />
      </div>
    </div>
  );
}
