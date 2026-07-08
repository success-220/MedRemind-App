import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function SignupPage() {
  const { signup, authError } = useContext(AuthContext);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (signup(form)) {
      navigate('/home');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__backdrop" aria-hidden="true" />
      <section className="auth-card">
        <h1>Create account</h1>
        <p className="auth-card__hint">Set up your reminder care account in minutes.</p>
        {authError && <p className="auth-card__error">{authError}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">Full Name<input className="auth-form__input" type="text" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
          <label className="auth-form__label">Email address<input className="auth-form__input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label className="auth-form__label">Password<input className="auth-form__input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          <label className="auth-form__label">Confirm Password<input className="auth-form__input" type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required /></label>
          <button className="button button--primary auth-form__submit">Create Account</button>
        </form>
        <p className="auth-card__footer">Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}

export default SignupPage;
