import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function LoginPage() {
  const { login, authError } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (login(form)) {
      navigate('/home');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__backdrop" aria-hidden="true" />
      <section className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-card__hint">Sign in to continue your care routine.</p>
        {authError && <p className="auth-card__error">{authError}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">
            Email address
            <input className="auth-form__input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="auth-form__label">
            Password
            <input className="auth-form__input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <button className="button button--primary auth-form__submit">Login</button>
        </form>
        <Link className="auth-card__link" to="/forgot-password">Forgot Password?</Link>
        <p className="auth-card__footer">
          New here? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
