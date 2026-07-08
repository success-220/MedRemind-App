import React, { useState } from 'react';
import '../styles/pages.css';

function FamilySupportPage() {
  const [caregiver, setCaregiver] = useState({ name: '', phone: '' });
  const [contacts, setContacts] = useState([]);

  const handleAdd = (event) => {
    event.preventDefault();
    if (!caregiver.name || !caregiver.phone) return;
    setContacts((current) => [...current, caregiver]);
    setCaregiver({ name: '', phone: '' });
  };

  return (
    <main className="page page--family">
      <section className="panel panel--hero">
        <h1>Family Support</h1>
        <p className="panel__subtitle">Keep caregivers and emergency contacts close.</p>
      </section>

      <section className="panel panel--form">
        <h2>Add caregiver</h2>
        <form className="form-grid" onSubmit={handleAdd}>
          <label className="form-field">
            Name
            <input
              type="text"
              value={caregiver.name}
              onChange={(event) => setCaregiver({ ...caregiver, name: event.target.value })}
              required
            />
          </label>
          <label className="form-field">
            Phone
            <input
              type="tel"
              value={caregiver.phone}
              onChange={(event) => setCaregiver({ ...caregiver, phone: event.target.value })}
              required
            />
          </label>
          <button className="button button--primary form-submit" type="submit">
            Add caregiver
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Emergency contacts</h2>
        <div className="card-list">
          {contacts.map((item, index) => (
            <article key={index} className="card card--contact">
              <p className="card__title">{item.name}</p>
              <p className="card__text">{item.phone}</p>
            </article>
          ))}
          {contacts.length === 0 && <p className="panel__text">No caregivers added yet.</p>}
        </div>
      </section>
    </main>
  );
}

export default FamilySupportPage;
