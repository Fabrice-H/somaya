import { AdminCard } from "@/shared/components/admin/ui/AdminCard";

const STEPS = [
  "Ajoutez vos collections avec un nom et une année.",
  "Choisissez une couleur de fond pour chaque collection.",
  "Utilisez l'icône œil pour masquer ou afficher une collection.",
  "Réordonnez avec les flèches haut et bas.",
];

export function CollectionsHelp() {
  return (
    <AdminCard title="Mode d'emploi">
      <ol className="m-0 list-none space-y-3 p-0">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3 text-[13px] font-light text-[var(--som-gray)]">
            <span className="w-5 shrink-0 text-[11px] font-medium tabular-nums tracking-[0.1em] text-[var(--som-primary)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </AdminCard>
  );
}
