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
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}