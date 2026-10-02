'use client';

import Link from 'next/link';

// Root error boundary for every route outside /menu (which has its own). Renders
// inside the root layout, so the header and footer stay; no stack trace is shown.
export default function RootError({ error, retry }) {
  return (
    <div className="page">
      <section className="state-card" role="alert" aria-labelledby="root-error-heading">
        <span className="state-card__icon" aria-hidden="true">
          ⚠️
        </span>
        <h1 id="root-error-heading">Something went wrong</h1>
        <p>We hit an unexpected problem. Your cart is saved in this browser — please try again.</p>
        {error?.digest && <p className="field-hint">Reference: {error.digest}</p>}
        <div className="state-card__actions">
          <button type="button" className="btn" onClick={() => retry()}>
            Try again
          </button>
          <Link href="/menu" className="btn btn--outline">
            Back to Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
