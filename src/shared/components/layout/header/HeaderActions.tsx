import Link from "next/link";
import { Gift, Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { AccountMenu } from "./AccountMenu";
import { NavLink } from "./NavLink";

const iconButton =
  "h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60";

type HeaderActionsProps = {
  searchOpen: boolean;
  onToggleSearch: () => void;
  isActive: (href: string) => boolean;
};

export function HeaderActions({ searchOpen, onToggleSearch, isActive }: HeaderActionsProps) {
  const hasMounted = useHasMounted();
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) => state.getItemCount());
  const count = hasMounted ? itemCount : 0;
  const cartLabel = count > 0 ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier";

  return (
    <div className="flex items-center justify-end md:gap-2 lg:gap-3">
      <button
        type="button"
        onClick={onToggleSearch}
        aria-label="Rechercher"
        aria-expanded={searchOpen}
        aria-controls="search-panel"
        className={`${iconButton} flex`}
      >
        <Search size={19} strokeWidth={1.4} />
      </button>
      <span className="mr-2 hidden lg:block">
        <NavLink href="/contact" active={isActive("/contact")}>
          Contact
        </NavLink>
      </span>
      <Link
        href="/fidelite"
        aria-label="Programme fidélité"
        title="Programme fidélité"
        aria-current={isActive("/fidelite") ? "page" : undefined}
        className={`${iconButton} hidden md:flex`}
      >
        <Gift size={19} strokeWidth={1.4} />
      </Link>
      <AccountMenu isActive={isActive} />
      <button type="button" onClick={openCart} aria-label={cartLabel} className={`${iconButton} relative -mr-3 flex`}>
        <ShoppingBag size={20} strokeWidth={1.4} />
        {count > 0 && (
          <span
            aria-hidden
            className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--som-accent)] px-1 text-[9.5px] font-semibold tabular-nums text-white"
          >
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
