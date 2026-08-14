import React, { createContext, useEffect, useState, useContext } from "react";
import { loadData, saveData } from "../utils/storage.js";


import { MedicationContext } from "./MedicationContext.jsx"; 

export const NotificationContext = createContext();

const NOTIFICATION_KEY = "medremind-notifications-prod"; 

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    loadData(NOTIFICATION_KEY, [])
  );
  
  const { medications } = useContext(MedicationContext);

  useEffect(() => {
    saveData(NOTIFICATION_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!medications || medications.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date();

      const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      medications.forEach(med => {

        if (med.time === currentTimeStr && !med.taken) {
          
          addNotification({
            title: `Time to take ${med.name}`,
            time: currentTimeStr
          });

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("MedRemind", {
              body: `It's time for your ${med.name} (${med.dosage || 'dose'})`,
              icon: "/icons/icon-192.svg"
            });
          }
        }
      });
    }, 60000); 

    return () => clearInterval(timer); 
  }, [medications]);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications((current) => {
      // Prevent duplicates
      const isDuplicate = current.some(
        (n) => n.title === notification.title && n.time === notification.time && n.status === "upcoming"
      );
      if (isDuplicate) return current;

      alert(`🔔 Reminder: ${notification.title}`);

      const newNotification = {
        id: `note-${Date.now()}`,
        title: notification.title,
        time: notification.time,
        status: "upcoming", 
      };
      return [newNotification, ...current];
    });
  };

  // Mark as completed
  const markCompleted = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "completed" } : item
      )
    );
  };

  // Mark as missed
  const markMissed = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "missed" } : item
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // Clear all notifications
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}