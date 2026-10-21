import { Eye, FolderOpen, ImageIcon } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";

type CategoryStatsProps = {
  total: number;
  withImage: number;
  active: number;
};

export function CategoryStats({ total, withImage, active }: CategoryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Catégories" value={total} hint="Dans le catalogue" icon={FolderOpen} />
      <StatCard label="En ligne" value={active} hint="Visibles en boutique" icon={Eye} tone="primary" />
      <StatCard label="Avec visuel" value={withImage} hint="Image renseignée" icon={ImageIcon} />
    </div>
  );
}
