import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Livraison 24h Abidjan" },
  { icon: ShieldCheck, label: "Qualité contrôlée" },
  { icon: RefreshCw, label: "Échange sous 48h" },
];

export function ProductReassurance() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
      {ITEMS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5 text-[13px] font-light text-[#4a4a4a]">
          <Icon size={17} strokeWidth={1.4} aria-hidden className="shrink-0 text-[var(--som-primary)]" />
          {label}
        </li>
      ))}
    </ul>
  );
}
