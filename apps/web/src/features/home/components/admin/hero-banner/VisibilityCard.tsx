import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";

type VisibilityCardProps = {
  isActive: boolean;
  onChange: (value: boolean) => void;
};

export function VisibilityCard({ isActive, onChange }: VisibilityCardProps) {
  return (
    <AdminCard
      title="Publication"
      action={<Badge tone={isActive ? "success" : "neutral"}>{isActive ? "En ligne" : "Masqué"}</Badge>}
    >
      <label className="flex min-h-10 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => onChange(event.target.checked)}
          className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--som-primary)]"
        />
        <span>
          <span className="block text-[14px] text-[var(--som-ink)]">Afficher sur le site</span>
          <span className="block text-[13px] font-light text-[var(--som-gray)]">
            Le hero apparaît en haut de la page d&apos;accueil.
          </span>
        </span>
      </label>
    </AdminCard>
  );
}
