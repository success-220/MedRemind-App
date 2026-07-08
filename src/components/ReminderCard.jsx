import React from 'react';
import '../styles/card.css';

function ReminderCard({ reminder, onMarkTaken, onSnooze }) {
  return (
    <article className="card card--reminder" aria-label={`Reminder for ${reminder.name}`}>
      <div className="card__header">
        <h3 className="card__title">{reminder.name}</h3>
        <span className="card__time">{reminder.time}</span>
      </div>
      <p className="card__text">Dosage: {reminder.dosage}</p>
      <div className="card__actions">
        <button className="button button--primary" onClick={() => onMarkTaken(reminder.id)}>
          Mark Taken
        </button>
        <button className="button button--secondary" onClick={() => onSnooze(reminder.id)}>
          Snooze
        </button>
      </div>
    </article>
  );
}

export default ReminderCard;
