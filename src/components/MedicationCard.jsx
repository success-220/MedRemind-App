import React from 'react';
import '../styles/card.css';

function MedicationCard({ medication, onEdit, onDelete }) {
  return (
    <article className="card card--medication">
      <div className="card__header">
        <h3 className="card__title">{medication.name}</h3>
        <span className="card__pill">{medication.frequency}</span>
      </div>
      <p className="card__text">Dosage: {medication.dosage}</p>
      <p className="card__text">Time: {medication.time}</p>
      <div className="card__actions">
        <button className="button button--small" onClick={() => onEdit(medication)}>
          Edit
        </button>
        <button className="button button--small button--tertiary" onClick={() => onDelete(medication.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default MedicationCard;
