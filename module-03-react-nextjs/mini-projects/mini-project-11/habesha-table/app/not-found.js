import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="ht-empty-state">
      <div className="ht-empty-icon">404 🍽️</div>
      <h1 className="ht-empty-title">Dish or Page Not Found</h1>
      <p className="ht-empty-text">
        The route or dish item you requested does not exist on the Habesha Table menu, or may have been colocated as a non-routable component.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/menu" className="ht-btn ht-btn--primary" id="not-found-menu-link">
          Explore Menu
        </Link>
        <Link href="/" className="ht-btn ht-btn--secondary" id="not-found-home-link">
          Return Home
        </Link>
      </div>
    </div>
  );
}
