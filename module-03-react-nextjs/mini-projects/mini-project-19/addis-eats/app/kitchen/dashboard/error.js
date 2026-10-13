'use client';

import Link from 'next/link';

// Error boundaries must be client components. In production only the error's `digest` reaches
// the browser; the real message stays in the server log.
export default function DashboardError({ error, reset }) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="back-link">Kitchen</span>
        <h1>Dashboard</h1>
      </header>
      <div className="state-container" role="alert">
        <div className="state-icon">⚠️</div>
        <h2 className="state-title">The dashboard couldn&apos;t be loaded</h2>
        <p className="state-text">
          No orders were changed. Try again; if it keeps failing, the server log has the details
          {error?.digest ? ` (reference ${error.digest})` : ''}.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
          <Link href="/kitchen/dashboard" className="btn btn-secondary">Reload dashboard</Link>
        </div>
      </div>
    </div>
  );
}
