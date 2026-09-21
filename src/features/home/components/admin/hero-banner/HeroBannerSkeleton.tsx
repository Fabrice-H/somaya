import { AdminPage } from "@/shared/components/admin/ui/AdminPage";

const card = "animate-pulse border border-[var(--som-border)] bg-white";

export function HeroBannerSkeleton() {
  return (
    <AdminPage eyebrow="Page d'accueil" title="Hero banner">
      <div className="h-12 border-b border-[var(--som-border)]" />
      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className={`${card} h-[200px]`} />
          <div className={`${card} h-[320px]`} />
        </div>
        <div className={`${card} h-[380px]`} />
      </div>
    </AdminPage>
  );
}
