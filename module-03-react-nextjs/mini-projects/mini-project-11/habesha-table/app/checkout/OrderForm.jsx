'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OrderForm() {
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ht-empty-state">
        <div className="ht-empty-icon">🎉</div>
        <h2 className="ht-empty-title" style={{ color: 'var(--ht-primary-strong)' }}>
          Order Confirmed!
        </h2>
        <p className="ht-empty-text">
          Thank you for ordering with Habesha Table. Your dish is being freshly prepared and will be delivered shortly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/menu" className="ht-btn ht-btn--primary" id="success-back-menu-link">
            Order More Dishes
          </Link>
          <Link href="/" className="ht-btn ht-btn--secondary" id="success-home-link">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>Checkout & Delivery</h1>
      <p style={{ color: 'var(--ht-ink-soft)', marginBottom: '2rem' }}>Choose how you'd like to pay, then confirm your delivery details below.</p>

      <form onSubmit={handleSubmit} className="ht-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--ht-accent-strong)' }}>
          1. Payment Method
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { id: 'telebirr', name: 'Telebirr 📲' },
            { id: 'cbe', name: 'CBE Birr 🏦' },
            { id: 'cash', name: 'Cash on Delivery 💵' },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--ht-radius-md)',
                background: paymentMethod === m.id ? 'var(--ht-accent-soft)' : 'var(--ht-surface-soft)',
                border: paymentMethod === m.id ? '2px solid var(--ht-accent)' : '1px solid var(--ht-border)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: paymentMethod === m.id ? '700' : '500',
              }}
            >
              {m.name}
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--ht-accent-strong)' }}>
          2. Delivery Address (Addis Ababa)
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--ht-ink-soft)' }}>
            Delivery Location / Sub-city
          </label>
          <input
            type="text"
            required
            defaultValue="Bole Atlas, near Medhanealem Church, Addis Ababa"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--ht-radius-sm)',
              background: 'var(--ht-surface-soft)',
              border: '1px solid var(--ht-border)',
              color: 'var(--ht-ink)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--ht-ink-soft)' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              defaultValue="Abebe Bikila"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--ht-radius-sm)',
                background: 'var(--ht-surface-soft)',
                border: '1px solid var(--ht-border)',
                color: 'var(--ht-ink)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--ht-ink-soft)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              required
              defaultValue="+251 91 123 4567"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--ht-radius-sm)',
                background: 'var(--ht-surface-soft)',
                border: '1px solid var(--ht-border)',
                color: 'var(--ht-ink)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--ht-border)', paddingTop: '1.5rem' }}>
          <Link href="/cart" className="ht-btn ht-btn--secondary" id="checkout-back-cart-link">
            &larr; Back to Cart
          </Link>
          <button type="submit" className="ht-btn ht-btn--primary" style={{ padding: '0.9rem 2rem' }} id="place-order-submit-btn">
            Place Order Now 🚀
          </button>
        </div>
      </form>
    </div>
  );
}
