'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Calendar,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Banknote,
  CreditCard,
} from 'lucide-react';
import type {
  Order,
  OrderStatus,
  OrdersStats,
  PaymentMethod,
} from './actions';

// ============================================================
// TYPES & CONSTANTS
// ============================================================

interface OrdersClientProps {
  orders: Order[];
  stats: OrdersStats;
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'preparing', label: 'En prép.' },
  { value: 'shipped', label: 'En livraison' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  preparing: { bg: '#EDE9FE', text: '#5B21B6' },
  shipped: { bg: '#CFFAFE', text: '#0E7490' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; icon: typeof Smartphone }
> = {
  mobile_money: { label: 'Mobile', icon: Smartphone },
  cash: { label: 'Espèces', icon: Banknote },
  bank_transfer: { label: 'Virement', icon: CreditCard },
};

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
}

// ============================================================
// COMPONENTS
// ============================================================

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 600,
        background: colors.bg,
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}

export function OrdersClient({
  orders,
  stats,
  total,
  page,
  totalPages,
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentDateFrom = searchParams.get('dateFrom') || '';
  const currentDateTo = searchParams.get('dateTo') || '';

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change (except page itself)
      if (!('page' in updates)) {
        params.delete('page');
      }

      startTransition(() => {
        router.push(`/admin/commandes?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const clearAllFilters = () => {
    startTransition(() => {
      router.push('/admin/commandes');
    });
  };

  const hasActiveFilters =
    currentStatus !== 'all' ||
    currentSearch !== '' ||
    currentDateFrom !== '' ||
    currentDateTo !== '';

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2a181d] mb-1">
          Commandes
        </h1>
        <p className="text-sm text-[#94786b]">
          Gérez les commandes de votre boutique
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = currentStatus === option.value;
            const count =
              option.value === 'all'
                ? stats.total
                : stats[option.value as keyof typeof stats] || 0;
            const colors =
              option.value !== 'all'
                ? STATUS_COLORS[option.value as OrderStatus]
                : null;

            return (
              <button
                key={option.value}
                onClick={() => updateFilters({ status: option.value })}
                disabled={isPending}
                className="inline-flex items-center gap-2 transition-all"
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: isActive ? 'transparent' : 'rgba(81,31,41,0.15)',
                  background: isActive
                    ? colors
                      ? colors.bg
                      : '#511F29'
                    : '#faf6f1',
                  color: isActive
                    ? colors
                      ? colors.text
                      : '#fcd3b4'
                    : '#94786b',
                  opacity: isPending ? 0.5 : 1,
                  cursor: isPending ? 'wait' : 'pointer',
                }}
              >
                {option.label}
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 6px',
                    background: isActive
                      ? 'rgba(0,0,0,0.1)'
                      : 'rgba(81,31,41,0.1)',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and date filters */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{
            padding: '16px 20px',
            background: '#faf6f1',
            border: '1px solid rgba(81,31,41,0.1)',
          }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94786b',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher (nom, téléphone, n° commande...)"
              value={currentSearch}
              onChange={(e) => updateFilters({ search: e.target.value })}
              style={{
                width: '100%',
                height: 44,
                paddingLeft: 44,
                paddingRight: currentSearch ? 44 : 16,
                border: '1px solid rgba(81,31,41,0.15)',
                background: 'white',
                fontSize: 14,
                color: '#2a181d',
                outline: 'none',
              }}
              className="focus:border-[#511F29]/40"
            />
            {currentSearch && (
              <button
                onClick={() => updateFilters({ search: null })}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94786b',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Date from */}
          <div className="relative">
            <Calendar
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94786b',
                pointerEvents: 'none',
              }}
            />
            <input
              type="date"
              value={currentDateFrom}
              onChange={(e) => updateFilters({ dateFrom: e.target.value })}
              style={{
                height: 44,
                paddingLeft: 40,
                paddingRight: 14,
                border: '1px solid rgba(81,31,41,0.15)',
                background: 'white',
                fontSize: 13,
                width: 160,
                cursor: 'pointer',
                color: '#2a181d',
              }}
            />
          </div>

          {/* Date to */}
          <div className="relative">
            <Calendar
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94786b',
                pointerEvents: 'none',
              }}
            />
            <input
              type="date"
              value={currentDateTo}
              onChange={(e) => updateFilters({ dateTo: e.target.value })}
              style={{
                height: 44,
                paddingLeft: 40,
                paddingRight: 14,
                border: '1px solid rgba(81,31,41,0.15)',
                background: 'white',
                fontSize: 13,
                width: 160,
                cursor: 'pointer',
                color: '#2a181d',
              }}
            />
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              disabled={isPending}
              className="inline-flex items-center gap-2 transition-colors hover:bg-white"
              style={{
                height: 44,
                padding: '0 16px',
                border: '1px solid rgba(81,31,41,0.15)',
                background: 'transparent',
                fontSize: 13,
                color: '#94786b',
                cursor: isPending ? 'wait' : 'pointer',
              }}
            >
              <X size={14} />
              Effacer
            </button>
          )}
        </div>

        {/* Loading indicator */}
        {isPending && (
          <div
            className="flex items-center gap-2"
            style={{ fontSize: 13, color: '#94786b' }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                border: '2px solid #511F29',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            Chargement...
          </div>
        )}
      </div>

      {/* Results count */}
      {total > 0 && (
        <p className="text-sm text-[#94786b] mb-4">
          {total} commande{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
        </p>
      )}

      {/* Table */}
      {orders.length === 0 ? (
        <div
          className="text-center"
          style={{
            padding: '64px 20px',
            background: '#faf6f1',
            border: '1px solid rgba(81,31,41,0.1)',
          }}
        >
          <Package
            size={48}
            style={{ color: '#94786b', margin: '0 auto 16px', opacity: 0.5 }}
          />
          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: '#2a181d',
              marginBottom: 4,
            }}
          >
            Aucune commande trouvée
          </p>
          <p style={{ fontSize: 14, color: '#94786b' }}>
            {hasActiveFilters
              ? 'Essayez de modifier vos filtres'
              : 'Les commandes apparaîtront ici'}
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              background: 'white',
              border: '1px solid rgba(81,31,41,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: '120px 1fr 140px 120px 100px 90px 60px',
                gap: 16,
                padding: '14px 20px',
                background: '#faf6f1',
                borderBottom: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                N° Commande
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Client
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Date
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'right',
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Paiement
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94786b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Statut
              </span>
              <span />
            </div>

            {/* Table rows */}
            {orders.map((order, i) => {
              const paymentMethod = PAYMENT_METHODS[order.payment_method];
              const PaymentIcon = paymentMethod?.icon;

              return (
                <Link
                  key={order.id}
                  href={`/admin/commandes/${order.id}`}
                  className="block md:grid transition-colors hover:bg-[#faf6f1]"
                  style={{
                    gridTemplateColumns:
                      '120px 1fr 140px 120px 100px 90px 60px',
                    gap: 16,
                    padding: '16px 20px',
                    borderBottom:
                      i < orders.length - 1
                        ? '1px solid rgba(81,31,41,0.1)'
                        : 'none',
                  }}
                >
                  {/* Order number */}
                  <span
                    style={{
                      fontSize: 12,
                      color: '#94786b',
                      fontFamily: 'monospace',
                    }}
                  >
                    {order.order_number}
                  </span>

                  {/* Customer */}
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#2a181d',
                        marginBottom: 2,
                      }}
                    >
                      {order.customer_name}
                    </p>
                    <p style={{ fontSize: 12, color: '#94786b' }}>
                      {order.customer_phone}
                    </p>
                  </div>

                  {/* Date */}
                  <span style={{ fontSize: 13, color: '#94786b' }}>
                    {formatDate(order.created_at)}
                  </span>

                  {/* Total */}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#2a181d',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                    }}
                  >
                    {formatPrice(order.total)}
                  </span>

                  {/* Payment */}
                  <span
                    className="flex items-center gap-2"
                    style={{ fontSize: 13, color: '#94786b' }}
                  >
                    {PaymentIcon && <PaymentIcon size={14} />}
                    <span className="hidden lg:inline">
                      {paymentMethod?.label}
                    </span>
                  </span>

                  {/* Status */}
                  <div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Action */}
                  <div className="flex justify-center">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94786b',
                      }}
                    >
                      <Eye size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => updateFilters({ page: String(page - 1) })}
                disabled={page <= 1 || isPending}
                className="w-10 h-10 flex items-center justify-center border border-[#511F29]/20 hover:bg-[#faf6f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <span key={p} className="flex items-center gap-2">
                      {showEllipsis && (
                        <span className="text-[#94786b]">...</span>
                      )}
                      <button
                        onClick={() => updateFilters({ page: String(p) })}
                        disabled={isPending}
                        className="w-10 h-10 flex items-center justify-center border transition-colors"
                        style={{
                          background:
                            p === page ? '#511F29' : 'transparent',
                          color: p === page ? '#fcd3b4' : '#2a181d',
                          borderColor:
                            p === page ? '#511F29' : 'rgba(81,31,41,0.2)',
                        }}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() => updateFilters({ page: String(page + 1) })}
                disabled={page >= totalPages || isPending}
                className="w-10 h-10 flex items-center justify-center border border-[#511F29]/20 hover:bg-[#faf6f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Spin animation */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
