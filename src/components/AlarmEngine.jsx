import React, { useEffect, useState, useRef, useContext } from "react";
import { MedicationContext } from "../context/MedicationContext"; 

export default function AlarmEngine() {
  const { medications } = useContext(MedicationContext);
  const [activeAlarms, setActiveAlarms] = useState([]); 
  
  const alarmAudio = useRef(new Audio("/alarm.mp3"));
  const rungToday = useRef(new Set());

  useEffect(() => {
    alarmAudio.current.loop = true; 
    
    // Test tool attached to the window so you can trigger it from console
    window.testAlarm = () => {
      console.log("🛠️ Testing Alarm Engine...");
      setActiveAlarms([{ id: "test", name: "Test Medication", dosage: "1 Pill" }]);
      alarmAudio.current.play().catch(e => alert("Please click the screen once to allow audio, then run testAlarm() again."));
    };
  }, []);

  //  EXACT-TIME CLOCK ENGINE
  useEffect(() => {
    if (!medications || medications.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime24 = `${currentHours}:${currentMinutes}`;
      
      const newAlarms = [];

      medications.forEach((med) => {
        if (!med.time) return;

        let medTime24 = String(med.time).trim();
        
        // Handle AM/PM
        if (medTime24.toUpperCase().includes("AM") || medTime24.toUpperCase().includes("PM")) {
          const [time, modifier] = medTime24.split(/(\s+)/).filter(e => e.trim().length > 0);
          let [hours, minutes] = time.split(":");
          if (hours === "12") hours = "00";
          if (modifier.toUpperCase() === "PM" && hours !== "12") hours = String(parseInt(hours, 10) + 12);
          medTime24 = `${String(hours).padStart(2, "0")}:${minutes}`;
        }
        if (medTime24.length === 4) medTime24 = `0${medTime24}`;

        const uniqueAlarmId = `${med.id}-${currentTime24}`;
        
        // THE TRIGGER
        if (medTime24 === currentTime24 && !rungToday.current.has(uniqueAlarmId)) {
          newAlarms.push(med);
          rungToday.current.add(uniqueAlarmId);
        }
      });

      if (newAlarms.length > 0) {
        alarmAudio.current.play().catch(e => console.log("Audio autoplay blocked by browser."));
        setActiveAlarms(prev => [...prev, ...newAlarms]);
      }

    }, 10000); 

    return () => clearInterval(timer);
  }, [medications]);

  const handleStopAlarm = (medicationId) => {
    if (activeAlarms.length === 1) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
    setActiveAlarms(current => current.filter(med => med.id !== medicationId));
  };

  // If no alarms are ringing, render absolutely nothing
  if (activeAlarms.length === 0) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ color: '#ff4444', marginTop: 0 }}>⏰ Medication Due!</h2>
        {activeAlarms.map(med => (
          <div key={med.id} style={medCardStyle}>
            <h3 style={{ margin: '0 0 5px 0' }}>{med.name || 'Test Medication'}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#aaaaaa' }}>Dosage: {med.dosage || '1 dose'}</p>
            
            <button 
              onClick={() => handleStopAlarm(med.id)}
              style={{ ...btnStyle, backgroundColor: '#2E7D32', width: '100%' }}
            >
              Take & Turn Off Alarm
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalStyle = { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', color: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const medCardStyle = { backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '12px', marginBottom: '15px', color: '#ffffff', border: '1px solid #3d3d3d' };
const btnStyle = { padding: '15px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };