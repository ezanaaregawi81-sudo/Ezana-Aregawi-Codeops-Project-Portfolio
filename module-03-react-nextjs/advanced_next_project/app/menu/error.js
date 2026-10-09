'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MenuError({ error, reset }) {
  useEffect(() => {
    console.error('Menu Segment Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="state-container">
      <div className="state-icon">⚠️</div>
      <h2 className="state-title" style={{ color: 'var(--accent-red)' }}>
        Something Went Wrong in the Menu Segment!
      </h2>
      <p className="state-text">
        {error?.message || 'Failed to load menu dishes. A simulated error was triggered for verification.'}
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary"
          id="error-reset-btn"
        >
          🔄 Try Again (Reset)
        </button>
        <Link href="/menu" className="btn btn-secondary" id="error-normal-menu-btn">
          Return to Menu
        </Link>
        <Link href="/" className="btn btn-secondary" id="error-home-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
}
