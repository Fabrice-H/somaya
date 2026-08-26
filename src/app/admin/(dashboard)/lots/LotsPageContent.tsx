"use client";

import { useState, useTransition, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, X, Layers, AlertTriangle } from "lucide-react";
import { formatPriceXOF } from "@/lib/utils";
import { deletePriceLot, togglePriceLotActive } from "@/features/admin/lots/actions";
import type { PriceLot } from "@/features/admin/lots/types";
import clsx from "clsx";

interface LotsPageContentProps {
  initialLots: PriceLot[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#2a181d]">{title}</h3>
            <p className="mt-2 text-[15px] text-[#94786b] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-4 bg-[#faf6f1]">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-[14px] font-medium text-[#2a181d] bg-white border border-[#e8ddd4] rounded-lg hover:bg-[#f5f0eb] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-[14px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LotsPageContent({ initialLots, categories }: LotsPageContentProps) {
  const [lots, setLots] = useState(initialLots);
  const [, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  // Modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    lotId: string;
    lotName: string;
  }>({ isOpen: false, lotId: "", lotName: "" });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openDeleteModal = useCallback((id: string, name: string) => {
    setDeleteModal({ isOpen: true, lotId: id, lotName: name });
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, lotId: "", lotName: "" });
    }
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    const { lotId } = deleteModal;
    if (!lotId) return;

    setIsDeleting(true);
    setLoadingId(lotId);

    const result = await deletePriceLot(lotId);
    if (result.success) {
      setLots((prev) => prev.filter((lot) => lot.id !== lotId));
    }

    setIsDeleting(false);
    setLoadingId(null);
    setDeleteModal({ isOpen: false, lotId: "", lotName: "" });
  }, [deleteModal]);

  // Stats calculations
  const totalLots = lots.length;
  const activeLots = lots.filter((l) => l.is_active).length;
  const totalArticles = lots.reduce((sum, lot) => sum + lot.total_items, 0);
  const totalStock = lots.reduce((sum, lot) => sum + lot.total_stock, 0);
  const outOfStockItems = lots.reduce((sum, lot) => {
    return sum + lot.items.filter((item) => item.stock <= 0).length;
  }, 0);

  // Get categories that have lots
  const categoriesWithLots = categories.filter((cat) =>
    lots.some((l) => l.category_id === cat.id)
  );

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#94786b] mb-1">
              BOUTIQUE / PAR BUDGET
            </p>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[#2a181d]">
              Lots de prix
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#2a181d] font-medium hidden md:block">
              {totalLots} LOTS · {totalArticles} ARTICLES
            </span>
            <Link
              href="/admin/lots/nouveau"
              className="inline-flex items-center gap-2 bg-[#511F29] text-[#fcd3b4] px-5 py-2.5 rounded-none font-medium text-sm tracking-wide hover:bg-[#3d171f] transition-colors"
            >
              <Plus size={16} />
              NOUVEAU LOT
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Lots Actifs */}
          <div className="bg-[#faf6f1] rounded-lg p-5 border border-[#e8ddd4]">
            <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#94786b] mb-3">
              LOTS ACTIFS
            </p>
            <p className="font-[family-name:var(--font-serif)] text-4xl text-[#2a181d] mb-1">
              {activeLots}/{totalLots}
            </p>
            <p className="text-[13px] text-[#94786b]">
              Visibles sur /lots
            </p>
          </div>

          {/* Articles en Ligne */}
          <div className="bg-[#faf6f1] rounded-lg p-5 border border-[#e8ddd4]">
            <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#94786b] mb-3">
              ARTICLES EN LIGNE
            </p>
            <p className="font-[family-name:var(--font-serif)] text-4xl text-[#2a181d] mb-1">
              {totalArticles}
            </p>
            <p className="text-[13px] text-[#94786b]">
              Toutes catégories
            </p>
          </div>

          {/* Stock Total */}
          <div className="bg-[#f5ebe3] rounded-lg p-5 border border-[#e0d0c4]">
            <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#94786b] mb-3">
              STOCK TOTAL
            </p>
            <p className="font-[family-name:var(--font-serif)] text-4xl text-[#2a181d] mb-1">
              {totalStock}
            </p>
            <p className="text-[13px] text-[#94786b]">
              Suivi à l'unité
            </p>
          </div>

          {/* Articles Épuisés */}
          <div className="bg-[#f5ebe3] rounded-lg p-5 border border-[#e0d0c4]">
            <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a3d48] mb-3">
              ARTICLES ÉPUISÉS
            </p>
            <p className="font-[family-name:var(--font-serif)] text-4xl text-[#7a3d48] mb-1">
              {outOfStockItems}
            </p>
            <p className="text-[13px] text-[#94786b]">
              Affichés « Épuisé »
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-[#e8ddd4] overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e8ddd4]">
            <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#2a181d]">
              TOUS LES LOTS
            </h2>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter(null)}
                className={clsx(
                  "px-4 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all whitespace-nowrap",
                  !filter
                    ? "bg-[#511F29] text-white"
                    : "bg-white text-[#2a181d] border border-[#e8ddd4] hover:bg-[#faf6f1]"
                )}
              >
                TOUT
              </button>
              {categoriesWithLots.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={clsx(
                    "px-4 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all whitespace-nowrap",
                    filter === cat.id
                      ? "bg-[#511F29] text-white"
                      : "bg-white text-[#2a181d] border border-[#e8ddd4] hover:bg-[#faf6f1]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredLots.length === 0 ? (
            <div className="text-center py-16">
              <Layers size={48} className="mx-auto text-[#e8ddd4] mb-4" />
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
            <div className="overflow-x-auto">
              {/* Column Headers */}
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px_100px_50px] gap-4 px-5 py-3 bg-[#faf6f1] border-b border-[#e8ddd4] text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94786b]">
                <div>LOT</div>
                <div>PRIX</div>
                <div>ARTICLES</div>
                <div>STOCK</div>
                <div>VISIBILITÉ</div>
                <div></div>
              </div>

              {/* Rows */}
              {filteredLots.map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => setSelectedLotId(lot.id === selectedLotId ? null : lot.id)}
                  className={clsx(
                    "grid grid-cols-1 md:grid-cols-[1fr_120px_100px_100px_100px_50px] gap-4 px-5 py-4 border-b border-[#e8ddd4] items-center cursor-pointer transition-colors hover:bg-[#faf6f1]",
                    loadingId === lot.id && "opacity-50 pointer-events-none",
                    selectedLotId === lot.id && "border-l-4 border-l-[#511F29] bg-[#faf6f1]"
                  )}
                >
                  {/* Lot Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f5f0eb] flex-shrink-0">
                      {lot.items[0]?.image ? (
                        <Image
                          src={lot.items[0].image}
                          alt={lot.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#d4c4b0]">
                          <Layers size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/lots/${lot.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-[#2a181d] hover:text-[#511F29] transition-colors"
                      >
                        {lot.name}
                      </Link>
                      {lot.category && (
                        <p className="text-[13px] text-[#94786b]">{lot.category.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-[#2a181d] font-medium">
                    <span className="md:hidden text-[#94786b] text-sm mr-2">Prix:</span>
                    {formatPriceXOF(lot.price).replace(' FCFA', ' F')}
                  </div>

                  {/* Articles */}
                  <div className="text-[#94786b]">
                    <span className="md:hidden text-[#94786b] text-sm mr-2">Articles:</span>
                    {lot.total_items} art.
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-[#94786b] text-sm mr-2">Stock:</span>
                    <span className={clsx(
                      "w-2 h-2 rounded-full",
                      lot.total_stock > 0 ? "bg-emerald-500" : "bg-red-400"
                    )} />
                    <span className={clsx(
                      lot.total_stock > 0 ? "text-emerald-600" : "text-red-500"
                    )}>
                      {lot.total_stock} u.
                    </span>
                  </div>

                  {/* Visibility Toggle */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggle(lot.id, !lot.is_active)}
                      className={clsx(
                        "relative w-12 h-6 rounded-full transition-colors",
                        lot.is_active ? "bg-emerald-500" : "bg-gray-300"
                      )}
                      aria-label={lot.is_active ? "Désactiver" : "Activer"}
                    >
                      <span
                        className={clsx(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                          lot.is_active ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>

                  {/* Delete */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openDeleteModal(lot.id, lot.name)}
                      className="p-2 text-[#c4b0a5] hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer ce lot ?"
        message={`Êtes-vous sûr de vouloir supprimer le lot "${deleteModal.lotName}" ? Cette action est irréversible et supprimera également toutes les images associées.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        isLoading={isDeleting}
      />
    </>
  );
}
