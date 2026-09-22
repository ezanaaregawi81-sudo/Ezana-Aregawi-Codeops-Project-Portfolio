import Link from 'next/link';
import { catalog } from '../../lib/dishes';

const CATEGORY_ICON = {
  Main: '🍛',
  Vegetarian: '🥗',
  Side: '🫓',
};

export default function HomePage() {
  const picks = catalog.slice(0, 3);

  return (
    <div className="sk-shell">
      <div className="sk-shell-header">
        <span className="sk-kicker">Home</span>
        <h1 className="sk-title">What are you craving today?</h1>
        <p className="sk-subtitle">Fresh Ethiopian dishes made to order, ready to browse and add to your basket.</p>
        <div className="sk-actions">
          <Link href="/menu" className="sk-btn sk-btn--solid">
            Browse the full menu
          </Link>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Popular right now</h2>
      <div className="sk-menu-list">
        {picks.map((dish) => (
          <Link key={dish.id} href={`/menu/${dish.id}`} className="sk-menu-row">
            <span className="sk-menu-row-icon" aria-hidden="true">
              {CATEGORY_ICON[dish.category] ?? '🍽️'}
            </span>
            <div className="sk-menu-row-body">
              <div className="sk-menu-row-name">{dish.name}</div>
              <span className="sk-menu-row-tag">{dish.category}</span>
            </div>
            <span className="sk-menu-row-price">${dish.price}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
