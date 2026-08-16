"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Layers,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  ChevronRight,
} from "lucide-react";
import { formatPriceXOF } from "@/lib/utils";
import { deletePriceLot, togglePriceLotActive } from "@/features/admin/lots/actions";
import type { PriceLot } from "@/features/admin/lots/types";
import clsx from "clsx";

interface LotsPageContentProps {
  initialLots: PriceLot[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function LotsPageContent({ initialLots, categories }: LotsPageContentProps) {
  const [lots, setLots] = useState(initialLots);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredLots = filter
    ? lots.filter((lot) => lot.category_id === filter)
    : lots;

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoadingId(id);
    startTransition(async () => {
      const result = await togglePriceLotActive(id, isActive);
      if (result.success) {
        setLots((prev) =>
          prev.map((lot) => (lot.id === id ? { ...lot, is_active: isActive } : lot))
        );
      }
      setLoadingId(null);
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le lot "${name}" ?`)) return;

    setLoadingId(id);
    startTransition(async () => {
      const result = await deletePriceLot(id);
      if (result.success) {
        setLots((prev) => prev.filter((lot) => lot.id !== id));
      }
      setLoadingId(null);
    });
  };

  // Group by price for stats
  const priceGroups = lots.reduce((acc, lot) => {
    const key = lot.price;
    if (!acc[key]) acc[key] = { count: 0, items: 0 };
    acc[key].count++;
    acc[key].items += lot.total_items;
    return acc;
  }, {} as Record<number, { count: number; items: number }>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[#511F29]">
            Lots de Prix
          </h1>
          <p className="text-[#94786b] mt-1">
            Gérez vos groupes d'articles par prix
          </p>
        </div>
        <Link
          href="/admin/lots/nouveau"
          className="inline-flex items-center gap-2 bg-[#511F29] text-[#fcd3b4] px-5 py-2.5 rounded-lg font-medium hover:bg-[#3d171f] transition-colors"
        >
          <Plus size={18} />
          Nouveau Lot
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-[#511F29]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#511F29]/10 flex items-center justify-center">
              <Layers size={20} className="text-[#511F29]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#511F29]">{lots.length}</p>
              <p className="text-sm text-[#94786b]">Lots</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#511F29]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#511F29]">
                {lots.reduce((sum, lot) => sum + lot.total_items, 0)}
              </p>
              <p className="text-sm text-[#94786b]">Articles</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white rounded-xl p-4 border border-[#511F29]/10">
          <p className="text-sm text-[#94786b] mb-2">Prix disponibles</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(priceGroups)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([price, data]) => (
                <span
                  key={price}
                  className="bg-[#faf6f1] text-[#511F29] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {formatPriceXOF(Number(price))} ({data.items} articles)
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter(null)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            !filter
              ? "bg-[#511F29] text-[#fcd3b4]"
              : "bg-white text-[#511F29] border border-[#511F29]/20 hover:bg-[#faf6f1]"
          )}
        >
          Tous ({lots.length})
        </button>
        {categories.map((cat) => {
          const count = lots.filter((l) => l.category_id === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                filter === cat.id
                  ? "bg-[#511F29] text-[#fcd3b4]"
                  : "bg-white text-[#511F29] border border-[#511F29]/20 hover:bg-[#faf6f1]"
              )}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Lots Grid */}
      {filteredLots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#511F29]/20">
          <Layers size={48} className="mx-auto text-[#511F29]/20 mb-4" />
          <p className="text-[#94786b] mb-4">Aucun lot de prix créé</p>
          <Link
            href="/admin/lots/nouveau"
            className="inline-flex items-center gap-2 text-[#511F29] font-medium hover:underline"
          >
            <Plus size={16} />
            Créer un lot
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              isLoading={loadingId === lot.id}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Lot Card Component
interface LotCardProps {
  lot: PriceLot;
  isLoading: boolean;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
}

function LotCard({ lot, isLoading, onToggle, onDelete }: LotCardProps) {
  const displayImages = lot.items.slice(0, 4);
  const hasMore = lot.items.length > 4;

  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-[#511F29]/10 overflow-hidden transition-all",
        isLoading && "opacity-50 pointer-events-none",
        !lot.is_active && "opacity-60"
      )}
    >
      {/* Images Grid */}
      <div className="grid grid-cols-4 gap-0.5 bg-[#511F29]/5">
        {displayImages.map((item, idx) => (
          <div key={item.id} className="relative aspect-square">
            <Image
              src={item.image}
              alt={item.label || `Article ${idx + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
            {item.stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">ÉPUISÉ</span>
              </div>
            )}
          </div>
        ))}
        {/* Fill empty slots */}
        {Array.from({ length: Math.max(0, 4 - displayImages.length) }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square bg-[#faf6f1]" />
        ))}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-[#511F29]">{lot.name}</h3>
            {lot.category && (
              <p className="text-xs text-[#94786b]">{lot.category.name}</p>
            )}
          </div>
          <span className="bg-[#511F29] text-[#fcd3b4] px-3 py-1 rounded-full text-sm font-semibold">
            {formatPriceXOF(lot.price)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#94786b] mb-4">
          <span>{lot.total_items} articles</span>
          <span>•</span>
          <span>{lot.total_stock} en stock</span>
          {hasMore && (
            <>
              <span>•</span>
              <span>+{lot.items.length - 4} autres</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/lots/${lot.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#faf6f1] text-[#511F29] rounded-lg text-sm font-medium hover:bg-[#f0e8e0] transition-colors"
          >
            <Edit size={14} />
            Modifier
          </Link>
          <button
            onClick={() => onToggle(lot.id, !lot.is_active)}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              lot.is_active
                ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
            title={lot.is_active ? "Désactiver" : "Activer"}
          >
            {lot.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => onDelete(lot.id, lot.name)}
            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
