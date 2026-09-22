'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MenuError({ error, reset }) {
  useEffect(() => {
    console.error('Menu Segment Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="ht-state">
      <div className="ht-state__icon">⚠️</div>
      <h2 className="ht-state__title" style={{ color: 'var(--ht-danger)' }}>
        Something Went Wrong in the Menu Segment!
      </h2>
      <p className="ht-state__text">
        {error?.message || 'Failed to load menu dishes. A simulated error was triggered for verification.'}
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          className="ht-btn ht-btn--primary"
          id="error-reset-btn"
        >
          🔄 Try Again (Reset)
        </button>
        <Link href="/menu" className="ht-btn ht-btn--secondary" id="error-normal-menu-btn">
          Return to Menu
        </Link>
        <Link href="/" className="ht-btn ht-btn--secondary" id="error-home-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
}
