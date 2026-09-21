export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CreditCard,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { getOrder, type OrderStatus, type PaymentMethod } from '@/features/orders/server/actions';
import { OrderStatusUpdate } from '@/features/orders/components/admin/OrderStatusUpdate';
import { NotifyCustomerButton } from '@/features/orders/components/admin/NotifyCustomerButton';

type Params = Promise<{ id: string }>;

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_CONFIG: Record<OrderStatus, { label: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', bgColor: '#FEF3C7', textColor: '#92400E', icon: AlertCircle },
  confirmed: { label: 'Confirmée', bgColor: '#DBEAFE', textColor: '#1E40AF', icon: CheckCircle },
  preparing: { label: 'En préparation', bgColor: '#EDE9FE', textColor: '#5B21B6', icon: Package },
  shipped: { label: 'En livraison', bgColor: '#CFFAFE', textColor: '#0E7490', icon: Truck },
  delivered: { label: 'Livrée', bgColor: '#D1FAE5', textColor: '#065F46', icon: CheckCircle },
  cancelled: { label: 'Annulée', bgColor: '#FEE2E2', textColor: '#991B1B', icon: XCircle },
};

const PAYMENT_METHODS: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  mobile_money: { label: 'Mobile Money', icon: Smartphone },
  cash: { label: 'Espèces', icon: Banknote },
  bank_transfer: { label: 'Virement bancaire', icon: CreditCard },
};

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
}

// ============================================================
// PAGE
// ============================================================

export default async function OrderDetailPage(props: { params: Params }) {
  const params = await props.params;
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const paymentMethod = PAYMENT_METHODS[order.payment_method];
  const PaymentIcon = paymentMethod?.icon || CreditCard;

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap"
        style={{
          padding: '24px 40px',
          background: 'white',
          borderBottom: '1px solid rgba(81,31,41,0.1)',
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/commandes"
            className="transition-colors hover:bg-[#fafafa]"
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(81,31,41,0.15)',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#000000' }}>
              Commande {order.order_number}
            </h1>
            <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 2 }}>
              <Clock size={12} className="inline mr-1" style={{ verticalAlign: 'middle' }} />
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '8px 16px',
              background: statusConfig.bgColor,
              color: statusConfig.textColor,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <StatusIcon size={16} />
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 40px' }}>
        <div className="grid lg:grid-cols-3 gap-6" style={{ maxWidth: 1200 }}>
          {/* Left column - Order details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles */}
            <div
              style={{
                background: 'white',
                border: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(81,31,41,0.1)',
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>
                  <Package size={16} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
                  Articles commandés ({order.order_items?.length || 0})
                </h2>
              </div>

              <div>
                {order.order_items?.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                    style={{
                      padding: '16px 24px',
                      borderBottom: i < (order.order_items?.length || 0) - 1 ? '1px solid rgba(81,31,41,0.1)' : 'none',
                    }}
                  >
                    <div
                      className="relative flex-shrink-0 overflow-hidden"
                      style={{ width: 56, height: 56, background: '#fafafa' }}
                    >
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} style={{ color: '#6b6b6b' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#000000' }}>
                        {item.product_name}
                      </p>
                      {item.lot_name && (
                        <p style={{ fontSize: 12, color: '#3c161e', fontWeight: 500 }}>
                          {item.lot_name}
                        </p>
                      )}
                      <p style={{ fontSize: 13, color: '#6b6b6b' }}>
                        {formatPrice(item.product_price)} × {item.quantity}
                      </p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#000000', fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(item.line_total)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding: '16px 24px', background: '#fafafa' }}>
                <div className="space-y-2">
                  <div className="flex justify-between" style={{ fontSize: 13, color: '#6b6b6b' }}>
                    <span>Sous-total</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: 13, color: '#6b6b6b' }}>
                    <span>Livraison</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(order.delivery_fee)}</span>
                  </div>
                  <div
                    className="flex justify-between pt-2"
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#000000',
                      borderTop: '1px solid rgba(81,31,41,0.1)',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                background: 'white',
                border: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(81,31,41,0.1)',
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>
                  Actions
                </h2>
              </div>

              <div style={{ padding: '24px' }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#000000', marginBottom: 12 }}>
                      Mettre à jour le statut
                    </p>
                    <OrderStatusUpdate
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#000000', marginBottom: 12 }}>
                      Prévenir le client
                    </p>
                    <NotifyCustomerButton order={order} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Customer info */}
          <div className="space-y-6">
            {/* Client */}
            <div
              style={{
                background: 'white',
                border: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(81,31,41,0.1)',
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>
                  <User size={16} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
                  Client
                </h2>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={16} style={{ color: '#6b6b6b', marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#000000' }}>
                        {order.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} style={{ color: '#6b6b6b', marginTop: 2 }} />
                    <div>
                      <a
                        href={`tel:${order.customer_phone}`}
                        style={{ fontSize: 14, color: '#3c161e' }}
                      >
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>

                  {order.customer_email && (
                    <div className="flex items-start gap-3">
                      <Mail size={16} style={{ color: '#6b6b6b', marginTop: 2 }} />
                      <div>
                        <a
                          href={`mailto:${order.customer_email}`}
                          style={{ fontSize: 14, color: '#3c161e' }}
                        >
                          {order.customer_email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      height: 1,
                      background: 'rgba(81,31,41,0.1)',
                      margin: '8px 0',
                    }}
                  />

                  <div className="flex items-start gap-3">
                    <MapPin size={16} style={{ color: '#6b6b6b', marginTop: 2 }} />
                    <div>
                      {order.customer_address && (
                        <p style={{ fontSize: 14, color: '#000000' }}>
                          {order.customer_address}
                        </p>
                      )}
                      <p style={{ fontSize: 13, color: '#6b6b6b' }}>
                        {order.customer_commune}
                      </p>
                    </div>
                  </div>

                  {order.customer_notes && (
                    <>
                      <div
                        style={{
                          height: 1,
                          background: 'rgba(81,31,41,0.1)',
                          margin: '8px 0',
                        }}
                      />
                      <div className="flex items-start gap-3">
                        <MessageSquare size={16} style={{ color: '#6b6b6b', marginTop: 2 }} />
                        <div>
                          <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 4 }}>
                            Notes du client
                          </p>
                          <p style={{ fontSize: 14, color: '#000000', fontStyle: 'italic' }}>
                            &ldquo;{order.customer_notes}&rdquo;
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div
              style={{
                background: 'white',
                border: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(81,31,41,0.1)',
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>
                  <CreditCard size={16} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
                  Paiement
                </h2>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '10px 16px',
                    background: '#fafafa',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#000000',
                  }}
                >
                  <PaymentIcon size={16} style={{ color: '#6b6b6b' }} />
                  {paymentMethod?.label || order.payment_method}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div
              style={{
                background: 'white',
                border: '1px solid rgba(81,31,41,0.1)',
              }}
            >
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(81,31,41,0.1)',
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>
                  <Clock size={16} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
                  Historique
                </h2>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#511f29',
                      }}
                    />
                    <div>
                      <p style={{ fontSize: 13, color: '#000000' }}>
                        Commande créée
                      </p>
                      <p style={{ fontSize: 11, color: '#6b6b6b' }}>
                        {formatShortDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  {order.updated_at !== order.created_at && (
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#16a34a',
                        }}
                      />
                      <div>
                        <p style={{ fontSize: 13, color: '#000000' }}>
                          Dernière mise à jour
                        </p>
                        <p style={{ fontSize: 11, color: '#6b6b6b' }}>
                          {formatShortDate(order.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#065F46',
                        }}
                      />
                      <div>
                        <p style={{ fontSize: 13, color: '#000000' }}>
                          Livrée
                        </p>
                        <p style={{ fontSize: 11, color: '#6b6b6b' }}>
                          {formatShortDate(order.delivered_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
