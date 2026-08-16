import React, { useContext, useState, useRef, useEffect } from "react";
import { SettingsContext } from "../context/SettingsContext";
import "../styles/appsettings.css";

export default function AppSettingsPage() {
  const { settings, toggleDarkMode, toggleReminders, changeAlarmSound } = useContext(SettingsContext);
  
  // Track which sound file is currently playing, and the audio instance
  const [playingSound, setPlayingSound] = useState(null);
  const audioRef = useRef(null);

  // Cleanup audio if they leave the page while it's playing
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePreview = (soundFile) => {
    // If the exact same sound is already playing, pause it
    if (playingSound === soundFile && audioRef.current) {
      audioRef.current.pause();
      setPlayingSound(null);
      return;
    }

    // If another sound is playing, stop it first
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create and play the new sound
    const audio = new Audio(soundFile);
    audioRef.current = audio;
    
    audio.play();
    setPlayingSound(soundFile);

    // When the audio finishes naturally, reset the icon back to play
    audio.onended = () => {
      setPlayingSound(null);
    };
  };

  return (
    <main className="settings-page">
      <div className="settings-container">
        
        <h1 className="settings-title">App Settings</h1>

        {/* Existing Toggles */}
        <div className="settings-section">
          {/* <label className="toggle-label">
            <input 
              type="checkbox" 
              className="toggle-checkbox"
              checked={settings.darkMode} 
              onChange={toggleDarkMode} 
            />
            <span>Dark Mode</span>
          </label> */}

          <label className="toggle-label">
            <input 
              type="checkbox" 
              className="toggle-checkbox"
              checked={settings.remindersEnabled} 
              onChange={toggleReminders} 
            />
            <span>Enable Notifications</span>
          </label>
        </div>

        <hr className="settings-divider" />

        {/* ALARM SOUND PICKER UI */}
        <div className="settings-section">
          <h2 className="settings-subtitle">Alarm Sound Preference</h2>
          <p className="settings-description">
            Current Sound: <strong>{
              settings.alarmSound === "/alarm.mp3" ? "Default Alarm" : 
              settings.alarmSound === "/alarm2.mp3" ? "Gentle Chime" : 
              settings.alarmSound === "/alarm3.mp3" ? "Classic Bell" : 
              "Custom Alarm"
            }</strong>
          </p>

          <div className="alarm-options-grid">
            
            {/* Sound Option 1 */}
            <div className={`alarm-card ${settings.alarmSound === "/alarm.mp3" ? "active-card" : ""}`}>
              <span className="alarm-name">🚨 Default Alarm</span>
              <div className="alarm-actions">
                <button className="btn-preview" onClick={() => togglePreview("/alarm.mp3")}>
                  {playingSound === "/alarm.mp3" ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button 
                  className={`btn-select ${settings.alarmSound === "/alarm.mp3" ? "selected" : ""}`}
                  onClick={() => changeAlarmSound("/alarm.mp3")} 
                  disabled={settings.alarmSound === "/alarm.mp3"}
                >
                  {settings.alarmSound === "/alarm.mp3" ? "Selected" : "Select"}
                </button>
              </div>
            </div>

            {/* Sound Option 2 */}
            <div className={`alarm-card ${settings.alarmSound === "/alarm2.mp3" ? "active-card" : ""}`}>
              <span className="alarm-name">✨ Gentle Chime</span>
              <div className="alarm-actions">
                <button className="btn-preview" onClick={() => togglePreview("/alarm2.mp3")}>
                  {playingSound === "/alarm2.mp3" ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button 
                  className={`btn-select ${settings.alarmSound === "/alarm2.mp3" ? "selected" : ""}`}
                  onClick={() => changeAlarmSound("/alarm2.mp3")} 
                  disabled={settings.alarmSound === "/alarm2.mp3"}
                >
                  {settings.alarmSound === "/alarm2.mp3" ? "Selected" : "Select"}
                </button>
              </div>
            </div>

            {/* Sound Option 3 */}
            <div className={`alarm-card ${settings.alarmSound === "/alarm3.mp3" ? "active-card" : ""}`}>
              <span className="alarm-name">🔔 Classic Bell</span>
              <div className="alarm-actions">
                <button className="btn-preview" onClick={() => togglePreview("/alarm3.mp3")}>
                  {playingSound === "/alarm3.mp3" ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button 
                  className={`btn-select ${settings.alarmSound === "/alarm3.mp3" ? "selected" : ""}`}
                  onClick={() => changeAlarmSound("/alarm3.mp3")} 
                  disabled={settings.alarmSound === "/alarm3.mp3"}
                >
                  {settings.alarmSound === "/alarm3.mp3" ? "Selected" : "Select"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}