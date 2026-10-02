'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { placeOrder } from '@/app/actions';
import { AREAS, PAYMENT_METHODS, validateCustomer } from '@/lib/order-schema';
import { formatETB } from '@/lib/pricing';

const initialState = { status: null, error: '', fieldErrors: {}, values: null };
const blank = { name: '', phone: '', area: AREAS[0], payment: PAYMENT_METHODS[0], notes: '' };

// Client because it needs useActionState (pending flag + the action's result) and
// instant validation. It is still a real <form action={…}>: with JavaScript off the
// browser posts it as plain HTML and the server action places the order anyway.
export default function CheckoutForm({ total }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [clientErrors, setClientErrors] = useState(null);
  const formRef = useRef(null);

  const errors = clientErrors ?? state.fieldErrors ?? {};
  const values = state.values ?? blank;

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    const first = ['name', 'phone', 'area', 'payment', 'notes'].find((name) => errors[name]);
    if (first) formRef.current?.elements.namedItem(first)?.focus();
  }, [state, clientErrors]); // eslint-disable-line react-hooks/exhaustive-deps

  // Same rules as the server, run first for instant feedback. The server still
  // validates everything again — this only saves a round trip.
  function handleSubmit(event) {
    const { fieldErrors } = validateCustomer(Object.fromEntries(new FormData(event.currentTarget)));
    if (Object.keys(fieldErrors).length > 0) {
      event.preventDefault();
      setClientErrors(fieldErrors);
    } else {
      setClientErrors(null);
    }
  }

  const describe = (name, hint) => [hint, errors[name] && `${name}-error`].filter(Boolean).join(' ') || undefined;
  const alert = state.status === 422 || state.status === 500 ? state.error : '';

  return (
    // `key` remounts the fields after each server response so a 422 refills them with
    // what was submitted (React resets uncontrolled forms after an action).
    <form
      key={JSON.stringify(state.values)}
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="checkout-form"
      aria-labelledby="delivery-heading"
    >
      <h2 id="delivery-heading" className="visually-hidden">
        Delivery details
      </h2>

      <label htmlFor="name">Full Name</label>
      <input id="name" name="name" type="text" autoComplete="name" defaultValue={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={describe('name')} required />
      {errors.name && (
        <p id="name-error" className="error-msg">
          {errors.name}
        </p>
      )}

      <label htmlFor="phone">Phone (TeleBirr)</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0911234567"
        defaultValue={values.phone}
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={describe('phone', 'phone-hint')}
        required
      />
      <p id="phone-hint" className="field-hint">
        Ethiopian mobile: 09XXXXXXXX or +2519XXXXXXXX
      </p>
      {errors.phone && (
        <p id="phone-error" className="error-msg">
          {errors.phone}
        </p>
      )}

      <label htmlFor="area">Delivery Area</label>
      <select id="area" name="area" defaultValue={values.area} aria-invalid={Boolean(errors.area)} aria-describedby={describe('area')}>
        {AREAS.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
      {errors.area && (
        <p id="area-error" className="error-msg">
          {errors.area}
        </p>
      )}

      <label htmlFor="payment">Payment Method</label>
      <select id="payment" name="payment" defaultValue={values.payment} aria-invalid={Boolean(errors.payment)} aria-describedby={describe('payment')}>
        {PAYMENT_METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      {errors.payment && (
        <p id="payment-error" className="error-msg">
          {errors.payment}
        </p>
      )}

      <label htmlFor="notes">Delivery Notes (optional)</label>
      <textarea
        id="notes"
        name="notes"
        rows={3}
        maxLength={300}
        placeholder="Gate code, landmark, extra instructions..."
        defaultValue={values.notes}
        aria-invalid={Boolean(errors.notes)}
        aria-describedby={describe('notes')}
      />
      {errors.notes && (
        <p id="notes-error" className="error-msg">
          {errors.notes}
        </p>
      )}

      {alert && (
        <p role="alert" className="form-alert">
          {alert}
        </p>
      )}

      <button type="submit" className="btn btn--block" disabled={pending} style={{ marginTop: '1.25rem' }}>
        {pending ? 'Placing order…' : `Place Order — ${formatETB(total)}`}
      </button>
    </form>
  );
}
