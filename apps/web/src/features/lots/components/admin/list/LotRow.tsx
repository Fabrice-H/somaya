import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Layers, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { Td } from "@/shared/components/admin/ui/Table";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";
import { formatPrice } from "@/shared/lib/format";
import { LotVisibilityToggle } from "./LotVisibilityToggle";
import type { PriceLot } from "@/features/lots/types";

type LotRowProps = {
  lot: PriceLot;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

export function LotRow({ lot, selected, loading, onSelect, onToggle, onDelete }: LotRowProps) {
  const cover = lot.items[0]?.image;
  const inStock = lot.total_stock > 0;

  return (
    <tr
      onClick={onSelect}
      className={clsx(
        "cursor-pointer border-b border-[var(--som-border)] transition-colors last:border-b-0 hover:bg-[var(--som-surface-alt)]",
        loading && "pointer-events-none opacity-50",
        selected && "bg-[var(--som-primary-50)] hover:bg-[var(--som-primary-50)]"
      )}
    >
      <Td>
        <div className="flex min-w-[220px] items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[var(--som-primary-50)]">
            {cover ? (
              <Image src={cover} alt={lot.name} fill className="object-cover" sizes="56px" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[var(--som-primary)]">
                <Layers size={18} strokeWidth={1.4} aria-hidden />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`${ADMIN_LOTS_PATH}/${lot.id}`}
              onClick={stopPropagation}
              className="font-medium text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
            >
              {lot.name}
            </Link>
            {lot.category && (
              <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">{lot.category.name}</p>
            )}
          </div>
        </div>
      </Td>
      <Td align="right">
        <span className="whitespace-nowrap tabular-nums">{formatPrice(lot.price)}</span>
      </Td>
      <Td align="right" muted>
        <span className="tabular-nums">{lot.total_items}</span>
      </Td>
      <Td>
        <Badge tone={inStock ? "success" : "danger"}>
          {inStock ? (
            <>
              En stock · <span className="tabular-nums">{lot.total_stock}</span>
            </>
          ) : (
            "Épuisé"
          )}
        </Badge>
      </Td>
      <Td>
        <div onClick={stopPropagation}>
          <LotVisibilityToggle active={lot.is_active} onToggle={onToggle} />
        </div>
      </Td>
      <Td align="right">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`${ADMIN_LOTS_PATH}/${lot.id}`}
            onClick={stopPropagation}
            className="btn-secondary btn-sm whitespace-nowrap"
          >
            <Pencil size={14} strokeWidth={1.5} aria-hidden />
            Modifier
          </Link>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            title="Supprimer"
            aria-label={`Supprimer ${lot.name}`}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:bg-white hover:text-[var(--som-error)]"
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </Td>
    </tr>
  );
}
