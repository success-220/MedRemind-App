import React, { createContext, useEffect, useState } from "react";
import { loadData, saveData } from "../utils/storage.js";

export const NotificationContext = createContext();

const NOTIFICATION_KEY = "medremind-notifications-prod"; 

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    loadData(NOTIFICATION_KEY, [])
  );

  useEffect(() => {
    saveData(NOTIFICATION_KEY, notifications);
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `note-${Date.now()}`,
      title: notification.title,
      time: notification.time,
      status: "upcoming",
    };
    setNotifications((current) => [newNotification, ...current]);
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