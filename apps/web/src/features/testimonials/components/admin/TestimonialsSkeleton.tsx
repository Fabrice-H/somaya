import { AdminPage } from "@/shared/components/admin/ui/AdminPage";

export function TestimonialsSkeleton() {
  return (
    <AdminPage
      eyebrow="Contenu"
      title="Témoignages"
      description="Gérez les avis clients affichés sur la page d'accueil."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[220px] animate-pulse border border-[var(--som-border)] bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[var(--som-surface)]" />
              <div className="h-3 w-28 bg-[var(--som-surface)]" />
            </div>
            <div className="mt-6 h-3 w-full bg-[var(--som-surface)]" />
            <div className="mt-2 h-3 w-4/5 bg-[var(--som-surface)]" />
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
