'use client';

import { useActionState } from 'react';
import { cancelOrder } from './actions';

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, pending] = useActionState(cancelOrder, { status: null });

  return (
    <form action={formAction} style={{ marginTop: '0.5rem' }}>
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        style={{ fontSize: '0.8rem', color: 'var(--accent-red)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        {pending ? 'Cancelling…' : 'Cancel order'}
      </button>
      {state.error && (
        <p role="alert" className="field-error">
          {state.error.message}
        </p>
      )}
    </form>
  );
}
