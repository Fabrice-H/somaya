'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Package,
  Eye,
  Star,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import type { Product } from './types';
import type { Category } from '@/features/admin/categories/actions';
import { deleteProduct } from './actions';

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 12;

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const stockFilter = searchParams.get('stock') || '';

  // Local state
  const [search, setSearch] = useState(searchQuery);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter && product.category_id !== categoryFilter) {
        return false;
      }

      // Stock filter
      if (stockFilter) {
        if (stockFilter === 'in_stock' && product.stock <= 0) return false;
        if (stockFilter === 'low_stock' && product.stock > product.low_stock_threshold) return false;
        if (stockFilter === 'out_of_stock' && product.stock > 0) return false;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => {
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.low_stock_threshold).length;
    const active = products.filter((p) => p.is_active).length;
    return { total: products.length, outOfStock, lowStock, active };
  }, [products]);

  // URL update helper
  const updateURL = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 when filters change (except when changing page)
    if (!('page' in params)) {
      newParams.delete('page');
    }
    startTransition(() => {
      router.push(`/admin/produits?${newParams.toString()}`, { scroll: false });
    });
  };

  // Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: search || null });
  };

  // Delete product
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deleteProduct(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
    if (!result.success) {
      alert(result.error || 'Erreur lors de la suppression');
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2a181d] mb-1">Produits</h1>
          <p className="text-sm text-[#94786b]">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f]"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" style={{ maxWidth: 800 }}>
        <div className="bg-[#faf6f1] border border-[#511F29]/10 p-4">
          <div className="text-2xl font-bold text-[#2a181d]">{stats.total}</div>
          <div className="text-xs text-[#94786b] mt-1">Total produits</div>
        </div>
        <div className="bg-[#faf6f1] border border-[#511F29]/10 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-xs text-[#94786b] mt-1">Actifs</div>
        </div>
        <div className="bg-[#faf6f1] border border-[#511F29]/10 p-4">
          <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
          <div className="text-xs text-[#94786b] mt-1">Stock faible</div>
        </div>
        <div className="bg-[#faf6f1] border border-[#511F29]/10 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          <div className="text-xs text-[#94786b] mt-1">Épuisés</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94786b]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full h-11 pl-10 pr-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40"
            />
          </div>
        </form>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => updateURL({ category: e.target.value || null })}
          className="h-11 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none cursor-pointer"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Stock filter */}
        <select
          value={stockFilter}
          onChange={(e) => updateURL({ stock: e.target.value || null })}
          className="h-11 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none cursor-pointer"
        >
          <option value="">Tous les stocks</option>
          <option value="in_stock">En stock</option>
          <option value="low_stock">Stock faible</option>
          <option value="out_of_stock">Épuisé</option>
        </select>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#94786b]">
          {filteredProducts.length === products.length
            ? `${products.length} produit${products.length > 1 ? 's' : ''}`
            : `${filteredProducts.length} sur ${products.length} produit${products.length > 1 ? 's' : ''}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-[#94786b]">
            Page {currentPage} sur {totalPages}
          </p>
        )}
      </div>

      {/* Products grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16 text-[#94786b]">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucun produit trouvé</p>
          <p className="text-sm">
            {searchQuery || categoryFilter || stockFilter
              ? 'Essayez de modifier vos filtres'
              : 'Commencez par ajouter votre premier produit'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-[#faf6f1] border border-[#511F29]/10 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#e8e0d8]">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={32} className="text-[#94786b] opacity-50" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.stock <= 0 && (
                    <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase">
                      Épuisé
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= product.low_stock_threshold && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase">
                      Stock faible
                    </span>
                  )}
                  {product.is_new && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase">
                      Nouveau
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="px-2 py-1 bg-[#511F29] text-[#fcd3b4] text-[10px] font-bold uppercase">
                      Vedette
                    </span>
                  )}
                </div>

                {/* Right badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {!product.is_active && (
                    <span className="px-2 py-1 bg-gray-600 text-white text-[10px] font-bold uppercase">
                      Inactif
                    </span>
                  )}
                </div>

                {/* Stock count */}
                {product.stock > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-medium">
                    Stock: {product.stock}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/produits/${product.id}`}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#2a181d] hover:bg-[#fcd3b4] transition-colors"
                  >
                    <Edit size={16} />
                  </Link>
                  <Link
                    href={`/produit/${product.slug}`}
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#2a181d] hover:bg-[#fcd3b4] transition-colors"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="w-10 h-10 flex items-center justify-center bg-white text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-[#2a181d] line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {product.is_featured && (
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                    )}
                    {product.is_bestseller && (
                      <Sparkles size={12} className="text-[#511F29]" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#94786b] mb-2 line-clamp-1">
                  {product.category?.name || 'Sans catégorie'}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-[#2a181d]">
                      {formatPrice(product.price)}
                    </span>
                    {product.old_price && (
                      <span className="text-xs text-[#94786b] line-through ml-2">
                        {formatPrice(product.old_price)}
                      </span>
                    )}
                  </div>
                  {product.sku && (
                    <span className="text-[10px] text-[#94786b] font-mono">
                      {product.sku}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => updateURL({ page: String(currentPage - 1) })}
            disabled={currentPage <= 1 || isPending}
            className="w-10 h-10 flex items-center justify-center border border-[#511F29]/20 hover:bg-[#faf6f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (totalPages <= 7) return true;
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 1) return true;
              return false;
            })
            .map((page, idx, arr) => {
              const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
              return (
                <span key={page} className="flex items-center gap-2">
                  {showEllipsis && <span className="text-[#94786b]">...</span>}
                  <button
                    onClick={() => updateURL({ page: String(page) })}
                    disabled={isPending}
                    className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                      page === currentPage
                        ? 'bg-[#511F29] text-[#fcd3b4] border-[#511F29]'
                        : 'border-[#511F29]/20 hover:bg-[#faf6f1]'
                    }`}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

          <button
            onClick={() => updateURL({ page: String(currentPage + 1) })}
            disabled={currentPage >= totalPages || isPending}
            className="w-10 h-10 flex items-center justify-center border border-[#511F29]/20 hover:bg-[#faf6f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-semibold text-[#2a181d]">
                Supprimer le produit
              </h3>
            </div>
            <p className="text-sm text-[#94786b] mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera également toutes les images associées.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="h-10 px-4 text-sm text-[#2a181d] hover:bg-[#faf6f1] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10 px-4 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
