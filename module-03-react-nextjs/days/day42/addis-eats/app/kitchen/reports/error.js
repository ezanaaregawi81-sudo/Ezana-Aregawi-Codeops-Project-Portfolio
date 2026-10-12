'use client';

import Link from 'next/link';

// Error boundaries are client components. In production the message is replaced by a generic
// one and only `digest` is passed through, so the real error stays in the server log.
export default function ReportsError({ error, reset }) {
  return (
    <div className="reports">
      <header className="reports-header">
        <span className="back-link">Kitchen</span>
        <h1>Kitchen Reports</h1>
      </header>
      <div className="state-container" role="alert">
        <div className="state-icon">⚠️</div>
        <h2 className="state-title">The reports couldn&apos;t be loaded</h2>
        <p className="state-text">
          No orders were changed. Try again; if it keeps happening, the server log has the details
          {error?.digest ? ` (reference ${error.digest})` : ''}.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try again
          </button>
          <Link href="/kitchen/reports" className="btn btn-secondary">
            Reload reports
          </Link>
        </div>
      </div>
    </div>
  );
}
