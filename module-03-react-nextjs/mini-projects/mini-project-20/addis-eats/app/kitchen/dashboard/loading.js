// While page.js renders. Each skeleton block is the size of what it stands in for (the chart
// frames share the same fixed height), so nothing shifts when the data arrives.
export default function DashboardLoading() {
  return (
    <div className="dashboard" aria-busy="true">
      <header className="dashboard-header">
        <span className="back-link">Kitchen</span>
        <h1>Dashboard</h1>
        <p role="status">Loading the last 14 days…</p>
      </header>
      <div className="dashboard-stats">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card skeleton" style={{ height: '86px' }} />
        ))}
      </div>
      {[1, 2].map((n) => (
        <div key={n} className="card dashboard-card">
          <div className="skeleton" style={{ height: '1.3rem', width: '55%', marginBottom: '1rem' }} />
          <div className="chart-frame skeleton" />
        </div>
      ))}
    </div>
  );
}
