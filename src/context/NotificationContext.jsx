import React, { createContext, useEffect, useState } from "react";
import { loadData, saveData } from "../utils/storage.js";

export const NotificationContext = createContext();

const NOTIFICATION_KEY = "medremind-notifications-v2";

const defaultNotifications = [
  {
    id: "note-1",
    title: "Time to take Heart Care",
    time: "8:00 AM",
    status: "upcoming",
  },
  {
    id: "note-2",
    title: "Vitamin D Reminder",
    time: "12:00 PM",
    status: "upcoming",
  },
  {
    id: "note-3",
    title: "Time to take Vitamin C",
    time: "2:00 PM",
    status: "upcoming",
  },
  {
    id: "note-4",
    title: "Omega 4 Reminder",
    time: "8:00 PM",
    status: "upcoming",
  },
  {
    id: "note-5",
    title: "Morning Blood Pressure Tablet",
    time: "7:00 AM",
    status: "completed",
  },
  {
    id: "note-6",
    title: "Calcium Supplement",
    time: "9:00 AM",
    status: "completed",
  },
  {
    id: "note-7",
    title: "Evening Diabetes Medication",
    time: "6:00 PM",
    status: "missed",
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    loadData(NOTIFICATION_KEY, defaultNotifications)
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
        item.id === id
          ? { ...item, status: "completed" }
          : item
      )
    );
  };

  // Mark as missed
  const markMissed = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "missed" }
          : item
      )
    );
  };

  // Delete one notification
  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Restore default notifications
  const resetNotifications = () => {
    setNotifications([...defaultNotifications]);
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
        resetNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}