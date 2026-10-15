'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useSubmitOnce } from '@/lib/use-submit-once';
import { signIn } from './actions';

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  minHeight: '44px',
};

const labelStyle = { display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' };

export default function SignInForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, { status: null });
  // A failed sign-in leaves focus nowhere (the button was disabled while pending). Put it back in
  // the email field; the error is still announced by role="alert".
  const submitOnce = useSubmitOnce(pending);
  const emailRef = useRef(null);
  useEffect(() => {
    if (state.error) emailRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} onSubmit={submitOnce} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="sign-in-email" style={labelStyle}>
          Email
        </label>
        <input
          ref={emailRef}
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email ?? ''}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="sign-in-password" style={labelStyle}>
          Password
        </label>
        <input id="sign-in-password" name="password" type="password" autoComplete="current-password" required style={inputStyle} />
      </div>

      {state.error && (
        <p role="alert" className="form-error">
          {state.error.message}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending} id="sign-in-submit">
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
