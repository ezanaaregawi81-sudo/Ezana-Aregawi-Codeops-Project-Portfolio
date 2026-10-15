'use client';

import { useActionState } from 'react';
import { useSubmitOnce } from '@/lib/use-submit-once';
import { cancelOrder } from './actions';

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, pending] = useActionState(cancelOrder, { status: null });
  // A double tap would otherwise send a second cancel, which fails as "already cancelled".
  const submitOnce = useSubmitOnce(pending);

  return (
    <form action={formAction} onSubmit={submitOnce} style={{ marginTop: '0.5rem' }}>
      <input type="hidden" name="orderId" value={orderId} />
      {/* Was bare 0.8rem text about 15px tall; now a 44px button. */}
      <button type="submit" disabled={pending} className="btn-cancel">
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
