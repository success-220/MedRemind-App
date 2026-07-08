import React, { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext.jsx";
import "../styles/pages.css";

function AppSettingsPage() {
  const { settings, toggleDarkMode } = useContext(SettingsContext);

  return (
    <main className="page page--settings">

      {/* Header */}
      <section className="panel panel--hero">
        <div className="hero-content">
          <p className="panel__eyebrow">Preferences</p>
          <h1 className="panel__title">App Settings</h1>
          <p className="panel__subtitle">
            Customize your MedRemind experience.
          </p>
        </div>
      </section>

      {/* Settings List */}
      <section className="panel">
        <div className="menu-list">

          <div className="menu-item">
            <span>🌐 Language</span>
            <strong>English</strong>
          </div>

          <div className="menu-item">
            <span>🔔 Reminder Sound</span>
            <strong>Enabled</strong>
          </div>

          <div className="menu-item">
            <span>🔊 Reminder Volume</span>
            <strong>High</strong>
          </div>

          <button
            className="menu-item menu-item--button"
            onClick={toggleDarkMode}
          >
            <span>🌙 Dark Mode</span>
            <strong>{settings.darkMode ? "On" : "Off"}</strong>
          </button>

          <div className="menu-item">
            <span>📳 Notifications</span>
            <strong>Enabled</strong>
          </div>

          <div className="menu-item">
            <span>☁ Backup & Restore</span>
            <strong>Available</strong>
          </div>

          <div className="menu-item">
            <span>🔒 Privacy</span>
            <strong>Protected</strong>
          </div>

          <div className="menu-item">
            <span>ℹ About</span>
            <strong>MedRemind v1.0</strong>
          </div>

        </div>
      </section>

      {/* Footer */}
      <section className="panel">
        <p className="panel__subtitle" style={{ textAlign: "center" }}>
          MedRemind Version 1.0.0
        </p>
      </section>

    </main>
  );
}

export default AppSettingsPage;