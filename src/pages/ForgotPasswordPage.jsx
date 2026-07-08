import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function ForgotPasswordPage() {
  const { forgotPassword, authError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (forgotPassword(email)) {
      setMessage('Reset instructions have been sent if your email is registered.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Forgot Password</h1>
        <p className="auth-card__hint">Enter your email to receive reset instructions.</p>
        {authError && <p className="auth-card__error">{authError}</p>}
        {message && <p className="auth-card__success">{message}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">
            Email address
            <input
              className="auth-form__input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="button button--primary auth-form__submit">Send Reset</button>
        </form>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
