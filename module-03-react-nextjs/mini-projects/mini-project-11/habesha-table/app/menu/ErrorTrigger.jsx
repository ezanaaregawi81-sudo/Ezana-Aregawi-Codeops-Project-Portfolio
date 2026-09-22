'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorTrigger() {
  const searchParams = useSearchParams();
  const simError = searchParams.get('simError') === 'true' || searchParams.get('error') === 'true';

  if (simError) {
    throw new Error('Simulated Menu Error: Triggered via query parameter (?simError=true) for testing error.js boundary!');
  }

  return (
    <div className="ht-toolbar">
      <span style={{ fontSize: '0.8rem', color: 'var(--ht-ink-faint)' }}>Test States:</span>
      <Link href="/menu?simError=true" className="ht-pill-link" id="sim-error-link">
        ⚠️ Trigger Error UI
      </Link>
    </div>
  );
}
