import React, { createContext, useEffect, useState } from 'react';
import { loadData, saveData } from '../utils/storage.js';

export const SettingsContext = createContext();

const SETTINGS_KEY = 'medremind-settings';

const defaultSettings = {
  darkMode: false,
  remindersEnabled: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadData(SETTINGS_KEY, defaultSettings));

  useEffect(() => {
    saveData(SETTINGS_KEY, settings);
  }, [settings]);

  useEffect(() => {
    try {
      if (settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch (e) {
      // ignore on server/non-DOM environments
    }
  }, [settings.darkMode]);

  const toggleDarkMode = () => setSettings((current) => ({ ...current, darkMode: !current.darkMode }));

  return (
    <SettingsContext.Provider value={{ settings, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}
