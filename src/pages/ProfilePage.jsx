import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { MedicationContext } from '../context/MedicationContext.jsx';
import { SettingsContext } from '../context/SettingsContext.jsx';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { medications } = useContext(MedicationContext);
  const { settings, toggleDarkMode } = useContext(SettingsContext);

  const adherence = Math.min(100, Math.round((medications.filter((item) => item.taken).length / Math.max(1, medications.length)) * 100));

  return (
    <main className="page page--profile">
      <section className="panel panel--hero panel--profile-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="profile-avatar" style={{ width: 96, height: 96, fontSize: '2rem' }}>{(user?.fullName || 'G').charAt(0).toUpperCase()}</div>
          <div>
            <h1>{user?.fullName || 'Guest User'}</h1>
            <p className="panel__subtitle">Medication adherence {adherence}%</p>
          </div>
        </div>
      </section>

      <section className="panel panel--menu-list">
        <div className="menu-item">
          <span>Personal Information</span>
          <strong>{user?.email || 'No email saved'}</strong>
        </div>
        <div className="menu-item">
          <span>Notification Preferences</span>
          <strong>Enabled</strong>
        </div>
        <div className="menu-item">
          <span>Accessibility</span>
          <div style={{ textAlign: 'right' }}>
            <div>High Contrast Mode</div>
            <div>Text Size</div>
          </div>
        </div>
        <div className="menu-item">
          <span>Help Center</span>
          <strong>Support</strong>
        </div>
        <button className="menu-item menu-item--button" onClick={() => navigate('/app-settings')}>
          <span>App Settings</span>
          <strong>Open</strong>
        </button>
      </section>

      <section className="panel panel--settings">
        <button className="button button--secondary" onClick={toggleDarkMode}>
          {settings.darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        </button>
        <button className="button button--danger button--large" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default ProfilePage;
