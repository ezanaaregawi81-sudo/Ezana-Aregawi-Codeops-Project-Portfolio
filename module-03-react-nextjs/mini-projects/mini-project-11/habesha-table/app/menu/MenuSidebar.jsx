'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MenuSidebar() {
  const [favoriteCount, setFavoriteCount] = useState(1);
  const [specialNote, setSpecialNote] = useState('Extra Mitmita & Injera');

  return (
    <div className="ht-widget">
      <div className="ht-widget-badge">
        <span>⚡ State Preserved Across Navigation</span>
      </div>

      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--ht-accent-strong)' }}>
        Persistent Sidebar State
      </h4>
      <p style={{ fontSize: '0.8rem', color: 'var(--ht-ink-soft)', marginBottom: '0.75rem' }}>
        This state lives in <code>app/menu/layout.js</code> and survives route transitions between <code>/menu</code> and <code>/menu/[id]</code>.
      </p>

      {/* Counter Demo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', background: 'var(--ht-surface)', padding: '0.5rem', borderRadius: 'var(--ht-radius-sm)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>⭐ Saved Favorites:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setFavoriteCount((prev) => Math.max(0, prev - 1))}
            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--ht-border)', background: 'var(--ht-surface-soft)', color: 'var(--ht-ink)', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ fontWeight: '800', color: 'var(--ht-accent-strong)', minWidth: '16px', textAlign: 'center' }}>
            {favoriteCount}
          </span>
          <button
            onClick={() => setFavoriteCount((prev) => prev + 1)}
            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--ht-border)', background: 'var(--ht-surface-soft)', color: 'var(--ht-ink)', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Note Input Demo */}
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ht-ink-soft)', marginBottom: '0.25rem' }}>
          Table Note (Nav Persistent):
        </label>
        <input
          type="text"
          value={specialNote}
          onChange={(e) => setSpecialNote(e.target.value)}
          style={{
            width: '100%',
            padding: '0.4rem 0.6rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--ht-radius-sm)',
            background: 'var(--ht-surface)',
            border: '1px solid var(--ht-border)',
            color: 'var(--ht-ink)',
          }}
        />
      </div>

      {/* Quick Navigation Links */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ht-border)' }}>
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ht-ink-faint)', marginBottom: '0.4rem' }}>
          Test Navigation State:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
          <Link href="/menu" style={{ color: 'var(--ht-accent-strong)', textDecoration: 'underline' }}>
            &bull; /menu (Main List)
          </Link>
          <Link href="/menu/kitfo" style={{ color: 'var(--ht-accent-strong)', textDecoration: 'underline' }}>
            &bull; /menu/kitfo (Dish Detail)
          </Link>
          <Link href="/menu/doro-wat" style={{ color: 'var(--ht-accent-strong)', textDecoration: 'underline' }}>
            &bull; /menu/doro-wat (Dish Detail)
          </Link>
        </div>
      </div>
    </div>
  );
}
