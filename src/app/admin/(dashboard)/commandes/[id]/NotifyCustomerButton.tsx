'use client';

import { MessageCircle, RefreshCw } from 'lucide-react';
import type { Order, OrderStatus } from '@/features/admin/orders/actions';

type NotifyCustomerButtonProps = {
  order: Order;
};

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: 'Votre commande {orderNumber} a bien été reçue et est en attente de confirmation.',
  confirmed: 'Bonne nouvelle ! Votre commande {orderNumber} a été confirmée.',
  preparing: 'Votre commande {orderNumber} est en cours de préparation.',
  shipped: 'Votre commande {orderNumber} est en cours de livraison !',
  delivered: 'Votre commande {orderNumber} a été livrée. Merci pour votre confiance !',
  cancelled: 'Votre commande {orderNumber} a été annulée.',
};

function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('225') ? cleanPhone : `225${cleanPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

export function NotifyCustomerButton({ order }: NotifyCustomerButtonProps) {
  const handleNotify = () => {
    const statusMessage = STATUS_MESSAGES[order.status].replace('{orderNumber}', order.order_number);
    const message = `Bonjour ${order.customer_first_name},\n\n${statusMessage}\n\nTotal: ${new Intl.NumberFormat('fr-FR').format(order.total)} FCFA\n\nL'équipe SO'MAYA`;
    const link = buildWhatsAppLink(order.customer_phone, message);
    window.open(link, '_blank');
  };

  const handleFollowUp = () => {
    const message = `Bonjour ${order.customer_first_name},\n\nNous avons bien reçu votre commande ${order.order_number}.\n\nMerci de confirmer votre disponibilité pour la livraison.\n\nL'équipe SO'MAYA`;
    const link = buildWhatsAppLink(order.customer_phone, message);
    window.open(link, '_blank');
  };

  const isPending = order.status === 'pending';

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleNotify}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
          width: '100%',
          padding: '10px 14px',
          fontSize: 14,
          fontWeight: 500,
          color: '#2a181d',
          background: 'white',
          border: '1px solid rgba(81,31,41,0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#faf6f1')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
      >
        <MessageCircle size={16} />
        Notifier le statut
      </button>
      {isPending && (
        <button
          onClick={handleFollowUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            fontWeight: 500,
            color: '#511F29',
            background: 'white',
            border: '1px solid #511F29',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(81,31,41,0.05)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
        >
          <RefreshCw size={16} />
          Relancer le client
        </button>
      )}
    </div>
  );
}
