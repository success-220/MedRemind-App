import React, { createContext, useEffect, useState, useContext } from 'react';
import agent from '../agent.js';
import { AuthContext } from './AuthContext.jsx';
import { loadData, saveData } from '../utils/storage.js';

export const SettingsContext = createContext();

const SETTINGS_KEY = 'medremind-settings';

// Added alarmSound to default settings
const defaultSettings = {
  darkMode: true,
  remindersEnabled: true,
  alarmSound: localStorage.getItem("medremind_alarm_sound") || "/alarm.mp3",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadData(SETTINGS_KEY, defaultSettings));
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const data = await agent.Settings.get();
      if (data.settings) {
        setSettings((current) => ({
          ...current,
          remindersEnabled: data.settings.medication_reminders ?? current.remindersEnabled,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings from database:", error);
    }
  };

  useEffect(() => {
    saveData(SETTINGS_KEY, settings);
    try {
      if (settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch (e) {
    }
  }, [settings]);

  const toggleDarkMode = () => {
    setSettings((current) => ({ ...current, darkMode: !current.darkMode }));
  };

  const toggleReminders = async () => {
    const newValue = !settings.remindersEnabled;
    setSettings((current) => ({ ...current, remindersEnabled: newValue }));
    
    // Save to backend
    if (user?.isAuthenticated) {
      try {
        await agent.Settings.update({ medication_reminders: newValue });
      } catch (error) {
        console.error("Failed to update settings in database:", error);
      }
    }
  };

  //  NEW: Function to change the sound and broadcast it
  const changeAlarmSound = (soundFile) => {
    // Update context state for the UI
    setSettings((current) => ({ ...current, alarmSound: soundFile }));
    
    // Save to specific key that AlarmEngine is watching
    localStorage.setItem("medremind_alarm_sound", soundFile);
    
    // Broadcast the change instantly to the AlarmEngine
    window.dispatchEvent(new Event("alarmSoundChanged"));
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        toggleDarkMode, 
        toggleReminders, 
        changeAlarmSound 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}