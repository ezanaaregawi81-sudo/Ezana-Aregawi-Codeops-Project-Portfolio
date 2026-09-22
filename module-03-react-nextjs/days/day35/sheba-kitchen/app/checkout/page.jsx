import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  return (
    <div className="sk-shell" style={{ maxWidth: '560px' }}>
      <div className="sk-shell-header">
        <span className="sk-kicker">Checkout</span>
        <h1 className="sk-title">Checkout</h1>
        <p className="sk-subtitle">
          {sessionToken ? `Session: ${sessionToken}` : 'Placeholder checkout form goes here.'}
        </p>
      </div>

      <div className="sk-panel">
        <p className="sk-subtitle">This step will collect delivery details and payment.</p>
        <Link href="/cart" className="sk-btn sk-btn--outline" style={{ marginTop: '1.25rem' }}>
          Back to cart
        </Link>
      </div>
    </div>
  );
}
