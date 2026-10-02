'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { clearCart, getCart } from '@/lib/cart';
import { AREA_OPTIONS, PAYMENT_METHODS } from '@/lib/order-schema';
import { computeTotals } from '@/lib/pricing';
import { placeOrder } from '../orders/actions';
import { useCartContext } from '../Providers';

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
};

const labelStyle = { display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' };

const emptyValues = { name: '', phone: '', area: AREA_OPTIONS[0], notes: '', paymentMethod: 'telebirr' };

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, { status: null });
  const [cartItems, setCartItems] = useState([]);
  const { refreshCart } = useCartContext();

  const values = state.values ?? emptyValues;
  const [paymentMethod, setPaymentMethod] = useState(values.paymentMethod);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  useEffect(() => {
    if (state.status === 201) {
      clearCart();
      setCartItems([]);
      refreshCart();
    }
    // refreshCart is recreated on every Providers render; only a new result should trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Branch on the status code, the same way the old fetch handled the response.
  let fieldErrors = {};
  let formError = '';
  switch (state.status) {
    case null:
      break;
    case 201:
      return (
        <div className="state-container">
          <div className="state-icon">🎉</div>
          <h2 className="state-title" style={{ color: 'var(--accent-gold)' }}>
            Order Confirmed!
          </h2>
          <p className="state-text">
            Thank you, {state.order.name}. Order <strong>{state.order.id}</strong> ({state.order.total} ETB) is being freshly
            prepared and will be delivered shortly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/orders" className="btn btn-primary" id="success-orders-link">
              View Order Board
            </Link>
            <Link href="/menu" className="btn btn-secondary" id="success-back-menu-link">
              Order More Dishes
            </Link>
          </div>
        </div>
      );
    case 422:
      fieldErrors = state.error.fieldErrors;
      formError = state.error.message;
      break;
    default:
      formError = state.error?.message ?? 'Something went wrong. Please try again.';
  }

  const { total } = computeTotals(cartItems);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Checkout & Delivery</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Complete your address and payment details below.</p>

      {/* key remounts the fields after each response so a 422 refills them with what was submitted */}
      <form action={formAction} noValidate key={JSON.stringify(state)} className="card" style={{ padding: '2rem' }}>
        <input type="hidden" name="items" value={JSON.stringify(cartItems.map(({ id, qty }) => ({ id, qty })))} />
        <input type="hidden" name="paymentMethod" value={paymentMethod} />

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
          1. Delivery Address (Addis Ababa)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <Field label="Full Name" name="name" error={fieldErrors.name}>
            <input id="checkout-name" name="name" type="text" defaultValue={values.name} placeholder="Abebe Bikila" style={inputStyle} />
          </Field>
          <Field label="Phone Number" name="phone" error={fieldErrors.phone}>
            <input id="checkout-phone" name="phone" type="tel" inputMode="numeric" defaultValue={values.phone} placeholder="10-digit phone number" style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          <Field label="Delivery Area" name="area" error={fieldErrors.area}>
            <select id="checkout-area" name="area" defaultValue={values.area} style={inputStyle}>
              {AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes" name="notes">
            <textarea id="checkout-notes" name="notes" rows={3} defaultValue={values.notes} placeholder="Optional delivery notes" style={inputStyle} />
          </Field>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
          2. Payment Method
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              aria-pressed={paymentMethod === m.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: paymentMethod === m.id ? 'rgba(229, 169, 60, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: paymentMethod === m.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: paymentMethod === m.id ? '700' : '500',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
        {fieldErrors.paymentMethod && <p className="field-error">{fieldErrors.paymentMethod}</p>}

        {fieldErrors.items && <p className="field-error" style={{ marginTop: '1rem' }}>{fieldErrors.items}</p>}
        {formError && (
          <p role="alert" className="form-error">
            {formError}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <Link href="/cart" className="btn btn-secondary" id="checkout-back-cart-link">
            &larr; Back to Cart
          </Link>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }} id="place-order-submit-btn" disabled={pending}>
            {pending ? 'Placing order…' : `Place Order · ${total} ETB 🚀`}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={`checkout-${name}`} style={labelStyle}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`checkout-${name}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
