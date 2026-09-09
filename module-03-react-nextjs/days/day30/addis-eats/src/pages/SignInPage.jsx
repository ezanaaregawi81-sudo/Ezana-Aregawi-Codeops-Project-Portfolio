import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('addis-eats-user', 'signed-in');

    const from = location.state?.from?.pathname ?? '/checkout';
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-card">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="signin-name">Name</label>
        <input
          id="signin-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
        />
        <button type="submit" disabled={!name.trim()}>Sign in</button>
      </form>
    </section>
  );
}

export default SignInPage;
