'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus, type OrderStatus } from '@/features/admin/orders/actions';

type OrderStatusUpdateProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'shipped', label: 'En livraison' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: OrderStatusUpdateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = async (newStatus: OrderStatus) => {
    if (newStatus === status) return;

    const previousStatus = status;
    setStatus(newStatus);
    setLoading(true);
    setMessage(null);

    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      setMessage({ type: 'success', text: 'Statut mis à jour' });
      router.refresh();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Erreur' });
      setStatus(previousStatus);
    }
    setLoading(false);
  };

  return (
    <div>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: 14,
          border: '1px solid rgba(81,31,41,0.2)',
          background: 'white',
          color: '#2a181d',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {message && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: message.type === 'success' ? '#065F46' : '#991B1B',
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
