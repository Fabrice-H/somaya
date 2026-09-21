import Image from "next/image";
import { formatPrice } from "@/shared/lib/format";
import type { LotOption, SelectedLotItem } from "../../types";

type LotPickerProps = {
  lots: LotOption[];
  selected: SelectedLotItem | null;
  onSelect: (item: SelectedLotItem) => void;
};

export function LotPicker({ lots, selected, onSelect }: LotPickerProps) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-4 p-0 text-[12px] uppercase tracking-[0.18em] text-[var(--som-ink)]">
        Choisissez votre article
        {selected && <span className="text-[var(--som-gray)]"> : {selected.itemLabel ?? selected.lotName}</span>}
      </legend>
      <div className="flex flex-col gap-6">
        {lots.map((lot) => (
          <div key={lot.id}>
            <p className="m-0 mb-2.5 flex items-baseline justify-between text-[13px] text-[var(--som-gray)]">
              <span>{lot.name}</span>
              <span className="tabular-nums text-[var(--som-ink)]">{formatPrice(lot.price)}</span>
            </p>
            <ul className="m-0 grid list-none grid-cols-4 gap-2 p-0 sm:grid-cols-5">
              {lot.items.map((item) => {
                const soldOut = !lot.isAvailable || item.stock <= 0;
                const active = selected?.itemId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={soldOut}
                      aria-pressed={active}
                      aria-label={`${item.label ?? lot.name}${soldOut ? " (épuisé)" : ""}`}
                      onClick={() =>
                        onSelect({
                          lotId: lot.id,
                          lotName: lot.name,
                          lotPrice: lot.price,
                          itemId: item.id,
                          itemImage: item.image,
                          itemStock: item.stock,
                          itemLabel: item.label,
                        })
                      }
                      className={`relative block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-[var(--som-primary-50)] outline-offset-2 transition-shadow disabled:cursor-not-allowed ${
                        active ? "shadow-[0_0_0_2px_var(--som-ink)]" : "hover:shadow-[0_0_0_1px_var(--som-border-strong)]"
                      }`}
                    >
                      <Image src={item.image} alt="" fill sizes="96px" className={`object-cover ${soldOut ? "opacity-40 grayscale" : ""}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
