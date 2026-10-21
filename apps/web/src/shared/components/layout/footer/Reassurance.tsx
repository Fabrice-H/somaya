import { REASSURANCES } from "@/shared/config/navigation";

export function Reassurance() {
  return (
    <section aria-label="Nos engagements" className="border-t border-[#ececec] bg-white px-4 py-12 md:py-16">
      <ul className="mx-auto grid max-w-[1240px] list-none gap-10 p-0 text-center md:grid-cols-3 md:gap-6">
        {REASSURANCES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center">
            <Icon size={40} strokeWidth={1.25} className="text-[var(--som-primary)]" aria-hidden />
            <h3 className="m-0 mt-5 text-[14px] font-medium uppercase tracking-[0.04em] text-[var(--som-ink)] md:text-[15px]">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-light leading-relaxed text-[var(--som-gray)]">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
