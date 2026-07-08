import React, { useContext, useState } from 'react';
import { MedicationContext } from '../context/MedicationContext.jsx';
import MedicationCard from '../components/MedicationCard.jsx';
import '../styles/MedicationPage.css';

const initialForm = {
  name: '',
  dosage: '',
  time: '',
  frequency: 'Daily',
  notes: '',
};

function MedicationsPage() {
  const { medications, addMedication, updateMedication, removeMedication } = useContext(MedicationContext);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.dosage || !form.time) {
      setError('Please fill out the name, dosage, and time.');
      return;
    }
    setError('');
    if (editingId) {
      updateMedication(editingId, form);
      setEditingId(null);
    } else {
      addMedication(form);
    }
    setForm(initialForm);
  };

  const handleEdit = (medication) => {
    setEditingId(medication.id);
    setForm({
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      frequency: medication.frequency,
      notes: medication.notes,
    });
  };

  return (
    <main className="page page--medications">
      <section className="panel panel--form">
        <h1>Medication Management</h1>
        <p className="panel__subtitle">Add, update, and remove your daily medications.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            Medication Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label className="form-field">
            Dosage
            <input
              type="text"
              value={form.dosage}
              onChange={(event) => setForm({ ...form, dosage: event.target.value })}
              required
            />
          </label>
          <label className="form-field">
            Time
            <input
              type="time"
              value={form.time}
              onChange={(event) => setForm({ ...form, time: event.target.value })}
              required
            />
          </label>
          <label className="form-field">
            Frequency
            <select
              value={form.frequency}
              onChange={(event) => setForm({ ...form, frequency: event.target.value })}
            >
              <option>Daily</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Weekly</option>
            </select>
          </label>
          <label className="form-field form-field--full">
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button--primary form-submit" type="submit">
            {editingId ? 'Update Medication' : 'Add Medication'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>Your medications</h2>
          <p>{medications.length} items</p>
        </div>
        <div className="card-list">
          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={handleEdit}
              onDelete={removeMedication}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default MedicationsPage;
