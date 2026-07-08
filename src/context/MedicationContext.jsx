import React, { createContext, useEffect, useState } from "react";
import { loadData, saveData } from "../utils/storage.js";

export const MedicationContext = createContext();

const MEDICATION_KEY = "medremind-medications";

const defaultMedications = [
  {
    id: "med-1",
    name: "Heart Care",
    dosage: "5mg",
    time: "08:00 AM",
    frequency: "Daily",
    notes: "Take with breakfast",
    taken: false,
    date: "2026-07-08",
  },
  {
    id: "med-2",
    name: "Vitamin D",
    dosage: "1000 IU",
    time: "12:00 PM",
    frequency: "Daily",
    notes: "After lunch",
    taken: true,
    date: "2026-07-10",
  },
];

export function MedicationProvider({ children }) {
  const [medications, setMedications] = useState(
    loadData(MEDICATION_KEY, defaultMedications)
  );

  useEffect(() => {
    saveData(MEDICATION_KEY, medications);
  }, [medications]);

  // Add Medication
  const addMedication = (medication) => {
    const newMedication = {
      id: `med-${Date.now()}`,
      taken: false,
      date: medication.date || new Date().toISOString().split("T")[0],
      ...medication,
    };

    setMedications((current) => [newMedication, ...current]);
  };

  // Update Medication
  const updateMedication = (id, updatedFields) => {
    setMedications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
  };

  // Delete Medication
  const removeMedication = (id) => {
    setMedications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // Mark as Taken
  const markTaken = (id) => {
    updateMedication(id, {
      taken: true,
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Mark as Missed
  const markMissed = (id) => {
    updateMedication(id, {
      taken: false,
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Snooze Medication
  const snoozeMedication = (id) => {
    const medication = medications.find((item) => item.id === id);

    if (!medication) return;

    let [time, period] = medication.time.split(" ");

    let [hour, minute] = time.split(":").map(Number);

    minute += 10;

    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }

    if (hour > 12) {
      hour = 1;
    }

    const nextTime = `${hour}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;

    updateMedication(id, {
      time: nextTime,
    });
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        removeMedication,
        markTaken,
        markMissed,
        snoozeMedication,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}