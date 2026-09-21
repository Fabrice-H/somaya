import Image from "next/image";
import type { EmptySuggestion } from "./types";

export function EmptyResults({
  activeLabels,
  suggestions,
  onClearAll,
  clearLabel,
  recommendations,
}: {
  activeLabels: string[];
  suggestions: EmptySuggestion[];
  onClearAll: () => void;
  clearLabel: string;
  recommendations?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col items-center bg-[var(--som-primary-50)] px-6 py-14 text-center md:px-12 md:py-16">
        <Image src="/images/logo_mark.png" alt="" width={330} height={291} className="h-9 w-auto opacity-80" />
        <h2 className="m-0 mt-6 text-[20px] font-medium text-[var(--som-ink)] md:text-[22px]">
          Aucune pièce ne correspond
        </h2>
        <p className="mx-auto mt-2 max-w-[440px] text-[14px] font-light leading-relaxed text-[#4a4a4a]">
          {activeLabels.length > 0 ? (
            <>
              Rien pour <span className="font-normal text-[var(--som-ink)]">{activeLabels.join(" · ")}</span> pour le
              moment. Nos pièces arrivent régulièrement.
            </>
          ) : (
            "Nos pièces arrivent régulièrement, revenez bientôt."
          )}
        </p>

        {suggestions.length > 0 && (
          <ul className="m-0 mt-7 flex list-none flex-wrap justify-center gap-2 p-0">
            {[...suggestions]
              .sort((a, b) => b.count - a.count)
              .map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={s.onClick}
                    className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[var(--som-primary-200)] bg-white px-4 text-[13px] text-[var(--som-ink)] transition-colors hover:border-[var(--som-primary)]"
                  >
                    <span className="text-[var(--som-gray)]">Retirer</span> {s.label}
                    <span className="text-[12px] text-[var(--som-primary)] tabular-nums">
                      · {s.count} pièce{s.count > 1 ? "s" : ""}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}

        <button type="button" onClick={onClearAll} className="btn-primary mt-8">
          {clearLabel}
        </button>
      </div>

      {recommendations && (
        <section aria-labelledby="empty-reco" className="mt-14 md:mt-16">
          <h2
            id="empty-reco"
            className="m-0 mb-6 text-[12px] font-medium uppercase tracking-[0.24em] text-[var(--som-ink)] md:mb-8"
          >
            Vous aimerez aussi
          </h2>
          {recommendations}
        </section>
      )}
    </div>
  );
}
