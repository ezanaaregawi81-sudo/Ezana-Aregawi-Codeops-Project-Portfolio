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
            onClick={() => setFavoriteCount((prev) => Math.max(0, prev - 1))}
            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ fontWeight: '800', color: 'var(--accent-gold)', minWidth: '16px', textAlign: 'center' }}>
            {favoriteCount}
          </span>
          <button
            onClick={() => setFavoriteCount((prev) => prev + 1)}
            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          Table Note:
        </label>
        <input
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
          <Link href="/menu" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
            &bull; /menu
          </Link>
          <Link href="/menu/kitfo" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
            &bull; /menu/kitfo
          </Link>
          <Link href="/menu/doro-wat" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
            &bull; /menu/doro-wat
          </Link>
        </div>
      </div>
    </div>
  );
}
