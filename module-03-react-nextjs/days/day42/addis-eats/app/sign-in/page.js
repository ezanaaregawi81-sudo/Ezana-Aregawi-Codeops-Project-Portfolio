import { redirect } from 'next/navigation';
import { safeNext } from '@/lib/safe-next';
import { getSession } from '@/lib/session';
import SignInForm from './SignInForm';

export const metadata = { title: 'Sign In - Addis Eats' };

export default async function SignInPage({ searchParams }) {
  const { next } = await searchParams;
  // Only the checked value is used from here on, so a crafted ?next= never reaches the form.
  const destination = safeNext(next);

  // Already signed in: skip the form and go where they were headed.
  if (await getSession()) redirect(destination);

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Sign In</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to check out and track your orders.</p>

      <SignInForm next={destination} />

      <div className="card" style={{ padding: '1.25rem', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--text-primary)' }}>Demo accounts</strong>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
          <li>abebe@example.com / injera123</li>
          <li>tirunesh@example.com / injera123</li>
          <li>kitchen@addiseats.et / kitchen123 (staff)</li>
        </ul>
      </div>
    </div>
  );
}
