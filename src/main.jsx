import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MedicationProvider } from './context/MedicationContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <MedicationProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </MedicationProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
  });
}
