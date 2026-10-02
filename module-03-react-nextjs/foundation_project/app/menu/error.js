'use client';

import Link from 'next/link';

// Error boundaries must be client components. This one catches anything thrown while
// rendering /menu or /menu/[id]; the header, cart badge and category sidebar live in
// layouts above it, so they survive. No stack trace is shown to the customer.
export default function MenuError({ error, retry }) {
  return (
    <section className="state-card" role="alert" aria-labelledby="menu-error-heading">
      <span className="state-card__icon" aria-hidden="true">
        🥘
      </span>
      <h2 id="menu-error-heading">The menu didn&apos;t load</h2>
      <p>Something went wrong in the kitchen while fetching our dishes. Your cart is safe — please try again.</p>
      {error?.digest && <p className="field-hint">Reference: {error.digest}</p>}
      <div className="state-card__actions">
        <button type="button" className="btn" onClick={() => retry()}>
          Try again
        </button>
        <Link href="/" className="btn btn--outline">
          Go home
        </Link>
      </div>
    </section>
  );
}
