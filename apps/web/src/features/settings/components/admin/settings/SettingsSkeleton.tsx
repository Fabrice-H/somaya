import { AdminPage } from "@/shared/components/admin/ui/AdminPage";

const block = "animate-pulse bg-[var(--som-surface)]";

export function SettingsSkeleton() {
  return (
    <AdminPage eyebrow="Configuration" title="Réglages">
      <div className="flex gap-7 border-b border-[var(--som-border)] pb-4">
        {[72, 56, 64, 80].map((width) => (
          <div key={width} className={`h-3 ${block}`} style={{ width }} />
        ))}
      </div>
      <div className="mt-8 border border-[var(--som-border)] bg-white p-6">
        <div className={`mb-8 h-3 w-40 ${block}`} />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className={`mb-3 h-3 w-28 ${block}`} />
              <div className={`h-[52px] ${block}`} />
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
