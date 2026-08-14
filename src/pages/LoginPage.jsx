// src/pages/LoginPage.jsx
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; 
import { AuthContext } from '../context/AuthContext.jsx';
import agent from '../agent.js'; 
import '../styles/auth.css';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";

function LoginPage() {

  const { login, setUser, authError } = useContext(AuthContext); 
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => { 
    event.preventDefault();
    setIsLoading(true); 
    
    const success = await login(form);
    
    if (success) {
      navigate('/home');
    } else {
      setIsLoading(false); 
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const data = await agent.Auth.googleLogin(credentialResponse.credential);
      
      const mappedUser = { 
        ...data.user, 
        fullName: data.user.full_name, 
        isAuthenticated: true 
      };
      
      localStorage.setItem("medremind_token", data.token);
      localStorage.setItem("medremind_user", JSON.stringify(mappedUser));
      
      if (setUser) setUser(mappedUser);
      navigate('/home');
    } catch (error) {
      console.error("Google login failed", error);
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            
            <button className="button button--primary auth-form__submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888', fontSize: '0.9rem' }}>
            or continue with
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
                setIsLoading(false);
              }}
              shape="pill" 
            />
          </div>
          
          <Link className="auth-card__link" to="/forgot-password">Forgot Password?</Link>
          <p className="auth-card__footer">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </section>
      </main>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;