'use client';

import { useState } from 'react';
import Link from 'next/link';
import { catalog } from '../../lib/dishes';

export default function MenuLayout({ children }) {
  const [tally, setTally] = useState(0);
  const categories = [...new Set(catalog.map((dish) => dish.category))];

  return (
    <div className="sk-shell">
      <div className="sk-menu-layout">
        <section className="sk-menu-main">{children}</section>

        <aside className="sk-rail">
          <h3 className="sk-rail-title">Menu segment</h3>

          <div className="sk-rail-counter">
            <p className="sk-rail-counter-label">
              Layout counter: <strong className="sk-rail-counter-value">{tally}</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="sk-btn sk-btn--outline sk-btn--small" onClick={() => setTally(tally + 1)}>
                +
              </button>
              <button type="button" className="sk-btn sk-btn--outline sk-btn--small" onClick={() => setTally(tally - 1)}>
                -
              </button>
            </div>
          </div>

          <h4 className="sk-rail-heading">Categories</h4>
          <ul className="sk-rail-list">
            <li>
              <Link href="/menu" className="sk-rail-link">
                All dishes
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link href={`/menu?category=${encodeURIComponent(category)}`} className="sk-rail-link">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
