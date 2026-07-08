import React from 'react';
import '../styles/calendar.css';

function CalendarWidget({ date, schedule }) {
  return (
    <section className="calendar-widget">
      <div className="calendar-widget__header">
        <h2 className="calendar-widget__title">{date}</h2>
      </div>
      <div className="calendar-widget__grid">
        {schedule.map((item) => (
          <div key={item.id} className="calendar-widget__item">
            <span className="calendar-widget__item-time">{item.time}</span>
            <span className="calendar-widget__item-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CalendarWidget;
