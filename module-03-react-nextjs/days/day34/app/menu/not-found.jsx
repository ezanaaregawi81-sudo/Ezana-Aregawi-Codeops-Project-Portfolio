import Link from 'next/link';

export default function MenuNotFound() {
  return (
    <div className="sk-shell">
      <div className="sk-status">
        <span className="sk-status-icon" aria-hidden="true">
          🍽️
        </span>
        <h1 className="sk-title">Dish not found</h1>
        <p className="sk-subtitle">We couldn&apos;t find a dish with that id.</p>
        <Link href="/menu" className="sk-btn sk-btn--solid">
          Back to menu
        </Link>
      </div>
    </div>
  );
}
