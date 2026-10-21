import { whatsappHref } from "@/shared/lib/phone";

export function WhatsAppButton({ number }: { number: string }) {
  return (
    <a
      href={whatsappHref(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-[26px] right-[26px] z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--som-primary)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-[var(--som-primary-hover)]"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9z" />
      </svg>
    </a>
  );
}
