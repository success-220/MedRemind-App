import React, { createContext, useEffect, useState, useContext } from "react";
import agent from "../agent.js";
import { AuthContext } from "./AuthContext.jsx";

export const MedicationContext = createContext();

export function MedicationProvider({ children }) {
  const [medications, setMedications] = useState([]);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchMedications();
    } else {
      setMedications([]); // Clear data if they log out
    }
  }, [user]);

  const fetchMedications = async () => {
    try {
      // Fetch both medications AND your dose history
      const medData = await agent.Medications.list();
      let doseData = { history: [] };
      try { doseData = await agent.Doses.history(); } catch (e) { console.warn("No doses yet"); }
      
      const todayStr = new Date().toISOString().split("T")[0];
      
      // Check which medications have a "TAKEN" log for today
      const todayDoses = (doseData.history || []).filter(
        d => d.scheduled_datetime.startsWith(todayStr) && d.status === "TAKEN"
      );

      const mappedMedications = (medData.medications || []).map(med => {
        const hasTakenToday = todayDoses.some(d => d.medication_id === med.id);
        return {
          ...med,
          dosage: med.type,
          time: med.reminder_times && med.reminder_times.length > 0 ? med.reminder_times[0] : "No time set",
          taken: hasTakenToday, // Sets to true if found in today's dose history!
          date: todayStr
        };
      });

      setMedications(mappedMedications);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const markTaken = async (id) => {
    setMedications((current) =>
      current.map((item) => (item.id === id ? { ...item, taken: true } : item))
    );
    
    try {
      await agent.Doses.log({
        medication_id: id,
        scheduled_datetime: new Date().toISOString(),
        status: "TAKEN"
      });
    } catch (error) {
      console.error("Failed to log dose to database", error);
    }
  };
  const addMedication = async (medication) => {
    try {
      await agent.Medications.create({
        name: medication.name,
        type: medication.dosage,          
        frequency: medication.frequency,
        reminder_times: [medication.time] 
      });
      
      await fetchMedications(); 
      
    } catch (error) {
      console.error("Failed to add medication:", error);
      alert("Failed to save medication. Check the console for details.");
    }
  };

  // 3. Update Medication in the real database
  const updateMedication = async (id, updatedFields) => {
    try {
      const backendPayload = {
        name: updatedFields.name,
        type: updatedFields.dosage, 
        frequency: updatedFields.frequency,
        reminder_times: updatedFields.time ? [updatedFields.time] : undefined
      };

      setMedications((current) =>
        current.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
      );
      
      await agent.Medications.update(id, backendPayload);
    } catch (error) {
      console.error("Failed to update medication:", error);
      fetchMedications(); 
    }
  };

  const removeMedication = async (id) => {
    try {
      setMedications((current) => current.filter((item) => item.id !== id));
      await agent.Medications.delete(id);
    } catch (error) {
      console.error("Failed to delete medication:", error);
      fetchMedications(); 
    }
  };

  const markMissed = (id) => {
    updateMedication(id, {
      taken: false,
      date: new Date().toISOString().split("T")[0],
    });
  };

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
    if (hour > 12) hour = 1;
    
    const nextTime = `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
    updateMedication(id, { time: nextTime });
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