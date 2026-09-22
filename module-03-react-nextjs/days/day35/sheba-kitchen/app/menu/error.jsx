'use client';

export default function MenuError({ error, reset }) {
  return (
    <div className="sk-shell">
      <div className="sk-status sk-status--error">
        <span className="sk-status-icon" aria-hidden="true">
          ⚠️
        </span>
        <h1 className="sk-title">Something went wrong</h1>
        <p className="sk-subtitle">{error.message}</p>
        <button type="button" className="sk-btn sk-btn--solid" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
