import { cardStyle } from "./styles";

const STEPS = [
  "Ajoutez vos collections avec un nom et une année",
  "Choisissez une couleur de fond pour chaque collection",
  "Utilisez l'icône œil pour masquer/afficher une collection",
  "Réordonnez avec les flèches haut/bas",
];

export function CollectionsHelp() {
  return (
    <div className="mt-6 bg-[#fafafa]" style={cardStyle}>
      <h3 className="text-sm font-semibold text-[#000000] mb-3">Comment ça marche ?</h3>
      <ul className="space-y-2 text-sm text-[#6b6b6b]">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-2">
            <span className="text-[#3c161e] font-semibold">{index + 1}.</span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
