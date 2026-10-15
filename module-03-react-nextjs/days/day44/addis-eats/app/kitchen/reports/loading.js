// Shown while page.js renders. Every skeleton block is the size of the real thing it stands in
// for (the chart frames are the same fixed height), so the page doesn't shift when data lands.
export default function ReportsLoading() {
  return (
    <div className="reports" aria-busy="true">
      <header className="reports-header">
        <span className="back-link">Kitchen</span>
        <h1>Kitchen Reports</h1>
        <p role="status">Loading the last 14 days…</p>
      </header>
      <div className="report-stats">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card skeleton" style={{ height: '84px' }} />
        ))}
      </div>
      {[1, 2].map((n) => (
        <div key={n} className="card report-card">
          <div className="skeleton" style={{ height: '1.3rem', width: '55%', marginBottom: '1rem' }} />
          <div className="chart-frame skeleton" />
        </div>
      ))}
    </div>
  );
}
