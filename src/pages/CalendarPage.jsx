import React, { useContext } from "react";
import { MedicationContext } from "../context/MedicationContext.jsx";
import CalendarWidget from "../components/CalendarWidget.jsx";
import "../styles/pages.css";
import "../styles/calendar.css"

function CalendarPage() {
  const { medications } = useContext(MedicationContext);

  const today = new Date();

  const currentDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const schedule = medications.map((item) => ({
    id: item.id,
    time: item.time,
    name: item.name,
  }));

  const missed = medications.filter((item) => !item.taken).length;

  // Calendar
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastOfMonth.getDate();
  const startWeekday = firstOfMonth.getDay();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Taken medication days
  const takenDays = medications
    .filter((med) => med.taken && med.date)
    .map((med) => new Date(med.date).getDate());

  // Missed medication days
  const missedDays = medications
    .filter((med) => !med.taken && med.date)
    .map((med) => new Date(med.date).getDate());

  return (
    <main className="page page--calendar">

      {/* HERO */}
      <section className="panel panel--hero">
        <h1>📅 Medication Calendar</h1>
        <p className="panel__subtitle">
          Track your medication history and reminders.
        </p>
      </section>

      {/* CALENDAR */}
      <section className="panel panel--calendar-grid">

        <div className="calendar-preview">

          <div className="calendar-preview__month">
            {today.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </div>

          <div className="calendar-grid">

            {weekdays.map((day) => (
              <div key={day} className="calendar-grid__weekday">
                {day}
              </div>
            ))}

            {Array.from({ length: startWeekday }).map((_, index) => (
              <div
                key={index}
                className="calendar-grid__day calendar-grid__day--empty"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {

              const day = index + 1;

              const isToday = day === today.getDate();

              const isTaken = takenDays.includes(day);

              const isMissed =
                missedDays.includes(day) && !isTaken;

              return (
                <div
                  key={day}
                  className={`calendar-grid__day
                    ${isToday ? "calendar-grid__day--today" : ""}
                    ${isTaken ? "calendar-grid__day--taken" : ""}
                    ${isMissed ? "calendar-grid__day--missed" : ""}
                  `}
                >
                  <span>{day}</span>

                  {isTaken && (
                    <div className="calendar-dot calendar-dot--taken"></div>
                  )}

                  {isMissed && (
                    <div className="calendar-dot calendar-dot--missed"></div>
                  )}

                </div>
              );
            })}

          </div>

          {/* Legend */}

          <div className="calendar-legend">

            <div className="legend-item">
              <span className="legend-color legend-green"></span>
              Taken
            </div>

            <div className="legend-item">
              <span className="legend-color legend-red"></span>
              Missed
            </div>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="calendar-summary">

          <h2>Today</h2>

          <p>{currentDate}</p>

          <div className="calendar-summary__stats">

            <div>
              <p className="stat-card__value">
                {schedule.length}
              </p>
              <p>Schedule Items</p>
            </div>

            <div>
              <p className="stat-card__value">
                {missed}
              </p>
              <p>Missed Doses</p>
            </div>

          </div>

        </div>

      </section>

      {/* TODAY'S SCHEDULE */}

      <section className="panel">
        <CalendarWidget
          date={currentDate}
          schedule={schedule}
        />
      </section>

    </main>
  );
}

export default CalendarPage;