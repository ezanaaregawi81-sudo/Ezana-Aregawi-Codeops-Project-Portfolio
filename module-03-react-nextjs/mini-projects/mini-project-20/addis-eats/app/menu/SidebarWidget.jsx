'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SidebarWidget() {
  const [favoriteCount, setFavoriteCount] = useState(1);
  const [specialNote, setSpecialNote] = useState('Extra Mitmita & Injera');

  return (
    <div className="sidebar-widget">
      <div className="persistent-badge">
        <span>⚡ Saved Favorites</span>
      </div>

      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
        Menu Side Notes
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>⭐ Saved Favorites:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            aria-label="Remove a favourite"
            className="stepper-btn"
            onClick={() => setFavoriteCount((prev) => Math.max(0, prev - 1))}
          >
            -
          </button>
          <span aria-live="polite" style={{ fontWeight: '800', color: 'var(--accent-gold)', minWidth: '16px', textAlign: 'center' }}>
            {favoriteCount}
          </span>
          <button
            type="button"
            aria-label="Add a favourite"
            className="stepper-btn"
            onClick={() => setFavoriteCount((prev) => prev + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="sidebar-note" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          Table Note:
        </label>
        <input
          id="sidebar-note"
          type="text"
          value={specialNote}
          onChange={(e) => setSpecialNote(e.target.value)}
          style={{
            width: '100%',
            padding: '0.4rem 0.6rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Quick links:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
          <Link href="/menu" className="quick-link">
            &bull; /menu
          </Link>
          <Link href="/menu/kitfo" className="quick-link">
            &bull; /menu/kitfo
          </Link>
          <Link href="/menu/doro-wat" className="quick-link">
            &bull; /menu/doro-wat
          </Link>
        </div>
      </div>
    </div>
  );
}
