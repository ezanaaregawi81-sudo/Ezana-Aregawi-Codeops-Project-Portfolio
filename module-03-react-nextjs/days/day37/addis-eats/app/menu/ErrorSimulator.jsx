'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorSimulator() {
  const searchParams = useSearchParams();
  const simError = searchParams.get('simError') === 'true' || searchParams.get('error') === 'true';

  if (simError) {
    throw new Error('Simulated Menu Error: Triggered via query parameter (?simError=true) for testing error.js boundary!');
  }

  return (
    <div className="controls-bar">
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Test States:</span>
      <Link href="/menu?simError=true" className="sim-link" id="sim-error-link">
        ⚠️ Trigger Error UI
      </Link>
    </div>
  );
}
