import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function validatePassword(password) {
  if (password.length <= 8) {
    return 'Password must be longer than 8 characters.';
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return 'Password must contain both letters and numbers.';
  }

  return '';
}

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const { signIn } = useAuth();
  const passwordError = validatePassword(password);
  const isFormValid = name.trim() && !passwordError;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({ name: true, password: true });
      return;
    }

    localStorage.setItem('addis-eats-user', 'signed-in');
    signIn();

    const from = location.state?.from?.pathname ?? '/checkout';
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-card">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="signin-name">Name</label>
        <input
          id="signin-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setTouched((previousTouched) => ({ ...previousTouched, name: true }))}
          placeholder="Enter your name"
          aria-invalid={Boolean(touched.name && !name.trim())}
          aria-describedby={touched.name && !name.trim() ? 'signin-name-error' : undefined}
        />
        {touched.name && !name.trim() && (
          <small id="signin-name-error" role="alert" style={{ color: 'red', display: 'block' }}>
            Name is required.
          </small>
        )}

        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => setTouched((previousTouched) => ({ ...previousTouched, password: true }))}
          placeholder="Enter your password"
          aria-invalid={Boolean(touched.password && passwordError)}
          aria-describedby={touched.password && passwordError ? 'signin-password-error' : undefined}
        />
        {touched.password && passwordError && (
          <small id="signin-password-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {passwordError}
          </small>
        )}

        <button type="submit" disabled={!isFormValid}>Sign in</button>
      </form>
    </section>
  );
}

export default SignInPage;
