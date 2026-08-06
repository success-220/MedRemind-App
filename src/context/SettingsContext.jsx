import React, { createContext, useEffect, useState, useContext } from 'react';
import agent from '../agent.js';
import { AuthContext } from './AuthContext.jsx';
import { loadData, saveData } from '../utils/storage.js';

export const SettingsContext = createContext();

const SETTINGS_KEY = 'medremind-settings';
const defaultSettings = {
  darkMode: true,
  remindersEnabled: true,
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

  return (
    <SettingsContext.Provider value={{ settings, toggleDarkMode, toggleReminders }}>
      {children}
    </SettingsContext.Provider>
  );
}