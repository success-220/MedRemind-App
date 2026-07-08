import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MedicationContext } from '../context/MedicationContext.jsx';
import '../styles/pages.css';

function ReminderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medications, markTaken, snoozeMedication } = useContext(MedicationContext);
  const reminder = medications.find((item) => item.id === id);

  if (!reminder) {
    return (
      <main className="page page--reminder">
        <section className="panel">
          <h1>Reminder not found</h1>
          <p>Please return to the medication list and select a reminder.</p>
          <button className="button button--primary" onClick={() => navigate('/medications')}>
            Back to medications
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page page--reminder">
      <section className="panel">
        <h1>{reminder.name}</h1>
        <p className="panel__subtitle">Dosage: {reminder.dosage}</p>
        <p className="panel__subtitle">Time: {reminder.time}</p>
        <p className="panel__text">Frequency: {reminder.frequency}</p>
        <p className="panel__text">Notes: {reminder.notes || 'No additional notes'}</p>
        <div className="button-group">
          <button className="button button--primary" onClick={() => markTaken(reminder.id)}>
            Mark as Taken
          </button>
          <button className="button button--secondary" onClick={() => snoozeMedication(reminder.id)}>
            Snooze Reminder
          </button>
        </div>
      </section>
    </main>
  );
}

export default ReminderPage;
