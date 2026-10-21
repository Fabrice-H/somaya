import Link from "next/link";
import { ArrowUpRight, Layers, Package, Store } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";

const ACTIONS = [
  { label: "Ajouter un produit", href: "/admin/produits/nouveau", icon: Package },
  { label: "Créer un lot de prix", href: "/admin/lots/nouveau", icon: Layers },
  { label: "Voir la boutique", href: "/", icon: Store, external: true },
];

export function QuickActions() {
  return (
    <AdminCard title="Raccourcis" padded={false}>
      <ul className="m-0 list-none p-0">
        {ACTIONS.map(({ label, href, icon: Icon, external }) => (
          <li key={href} className="border-b border-[var(--som-border)] last:border-b-0">
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              className="group flex min-h-14 items-center gap-3 px-5 text-[14px] text-[var(--som-ink)] transition-colors hover:bg-[var(--som-surface-alt)] lg:px-6"
            >
              <span className="flex h-9 w-9 items-center justify-center bg-[var(--som-primary-50)] text-[var(--som-primary)]">
                <Icon size={16} strokeWidth={1.5} aria-hidden />
              </span>
              <span className="flex-1">{label}</span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                aria-hidden
                className="text-[var(--som-gray)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
