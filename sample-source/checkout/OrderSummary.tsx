// Sample checkout component — critical flow with hardcoded strings

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: Item[];
  onPlaceOrder: () => void;
}

export const OrderSummary: React.FC<Props> = ({ items, onPlaceOrder }) => {
  const { t } = useTranslation('checkout');
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="order-summary">
      {/* Already translated */}
      <h2>{t('order_summary')}</h2>

      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            <span>{item.name}</span>
            {/* Hardcoded quantity label */}
            <span>Qty: {item.quantity}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        /* Hardcoded empty state */
        <p>Your cart is empty. Add items to continue.</p>
      )}

      <div className="totals">
        <div>{t('subtotal')}: ${subtotal.toFixed(2)}</div>
        {/* Hardcoded */}
        <div>Estimated shipping: Free</div>
        <div>Tax (estimated): ${(subtotal * 0.08).toFixed(2)}</div>
      </div>

      {/* Hardcoded button tooltip */}
      <button
        onClick={onPlaceOrder}
        aria-label="Complete purchase and place your order"
        title="Click to complete your purchase"
      >
        {t('place_order')}
      </button>

      {/* Hardcoded security note */}
      <p className="security-note">Your payment information is encrypted and secure.</p>
    </div>
  );
};
