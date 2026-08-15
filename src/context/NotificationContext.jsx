import React, { createContext, useEffect, useState, useRef } from "react";
import agent from "../agent.js";
import { loadData, saveData } from "../utils/storage.js";

export const NotificationContext = createContext();

const NOTIFICATION_KEY = "medremind-notifications-prod"; 

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    loadData(NOTIFICATION_KEY, [])
  );
  
  const [activeAlarms, setActiveAlarms] = useState([]);
  
  const alarmAudio = useRef(new Audio("/alarm.mp3.wav"));

  useEffect(() => {
    saveData(NOTIFICATION_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    alarmAudio.current.loop = true; 
  }, []);

  useEffect(() => {
    const checkBackendReminders = async () => {
      try {

        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, "0");
        const currentMinutes = String(now.getMinutes()).padStart(2, "0");
        const localTime24 = `${currentHours}:${currentMinutes}`;

        const response = await agent.Reminders.checkDue(localTime24);
        
        if (response.dueReminders && response.dueReminders.length > 0) {
          
          if (activeAlarms.length === 0) {
            alarmAudio.current.play().catch(e => {
              console.log("Audio blocked! User needs to click the screen first.");
            });
          }
          
          setActiveAlarms(response.dueReminders);

          response.dueReminders.forEach(med => {
            addNotification({
              title: `Time to take ${med.name}`,
              time: med.time
            });
          });
        }
      } catch (error) {
        console.error("Failed to poll reminders", error);
      }
    };

    checkBackendReminders();
    const pollTimer = setInterval(checkBackendReminders, 30000); 

    return () => clearInterval(pollTimer);
  }, [activeAlarms.length]);

  const handleSnooze = async (medicationId) => {
    try {
      await agent.Reminders.snooze(medicationId);
      
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0; 
      setActiveAlarms(current => current.filter(med => med.id !== medicationId));
      
    } catch (error) {
      console.error("Failed to snooze", error);
    }
  };

  const handleTakeMedication = async (medicationId) => {
    try {
      await agent.Doses.log({ medicationId, takenAt: new Date().toISOString() });      
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
      setActiveAlarms(current => current.filter(med => med.id !== medicationId));
    } catch (error) {
      console.error("Failed to mark taken", error);
    }
  };

  // --- ORIGINAL NOTIFICATION FUNCTIONS ---
  const addNotification = (notification) => {
    setNotifications((current) => {
      const isDuplicate = current.some(
        (n) => n.title === notification.title && n.time === notification.time && n.status === "upcoming"
      );
      if (isDuplicate) return current;

      const newNotification = {
        id: `note-${Date.now()}`,
        title: notification.title,
        time: notification.time,
        status: "upcoming",
      };
      return [newNotification, ...current];
    });
  };

  const markCompleted = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "completed" } : item
      )
    );
  };

  const markMissed = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "missed" } : item
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markCompleted,
        markMissed,
        deleteNotification,
        clearNotifications,
        activeAlarms,
        handleSnooze,
        handleTakeMedication
      }}
    >
      {children}
      
      {/* THE ALARM OVERLAY UI */}
      {activeAlarms.length > 0 && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: '#ff4444', marginTop: 0 }}>⏰ Medication Due!</h2>
            {activeAlarms.map(med => (
              <div key={med.id} style={medCardStyle}>
                <h3 style={{ margin: '0 0 5px 0' }}>{med.name}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#aaaaaa' }}>Dosage: {med.dosage}</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleTakeMedication(med.id)}
                    style={{ ...btnStyle, backgroundColor: '#2E7D32' }}
                  >
                    Take
                  </button>
                  <button 
                    onClick={() => handleSnooze(med.id)}
                    style={{ ...btnStyle, backgroundColor: '#F57C00' }}
                  >
                    Snooze 5m
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Styled with a dark theme layout
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalStyle = {
  backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '16px',
  width: '90%', maxWidth: '400px', textAlign: 'center', color: '#ffffff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};
const medCardStyle = {
  backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '12px', 
  marginBottom: '15px', color: '#ffffff', border: '1px solid #3d3d3d'
};
const btnStyle = {
  flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
  color: 'white', fontWeight: 'bold', cursor: 'pointer',
  transition: 'opacity 0.2s'
};