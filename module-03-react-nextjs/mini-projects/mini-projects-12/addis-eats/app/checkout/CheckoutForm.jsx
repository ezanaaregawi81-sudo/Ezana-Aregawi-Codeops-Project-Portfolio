'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="state-container">
        <div className="state-icon">🎉</div>
        <h2 className="state-title" style={{ color: 'var(--accent-gold)' }}>
          Order Confirmed!
        </h2>
        <p className="state-text">
          Thank you for ordering with Addis Eats. Your dish is being freshly prepared and will be delivered shortly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary" id="success-back-menu-link">
            Order More Dishes
          </Link>
          <Link href="/" className="btn btn-secondary" id="success-home-link">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Checkout & Delivery</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Complete your address and payment details below.</p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
          1. Delivery Address (Addis Ababa)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              defaultValue="Abebe Bikila"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              required
              defaultValue="+251 91 123 4567"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            Delivery Location / Sub-city
          </label>
          <input
            type="text"
            required
            defaultValue="Bole Atlas, near Medhanealem Church, Addis Ababa"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
          2. Payment Method
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
                borderRadius: 'var(--radius-md)',
                background: paymentMethod === m.id ? 'rgba(229, 169, 60, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: paymentMethod === m.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: paymentMethod === m.id ? '700' : '500',
              }}
            >
              {m.name}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <Link href="/cart" className="btn btn-secondary" id="checkout-back-cart-link">
            &larr; Back to Cart
          </Link>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }} id="place-order-submit-btn">
            Place Order Now 🚀
          </button>
        </div>
      </form>
    </div>
  );
}
