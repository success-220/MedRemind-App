import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { MedicationContext } from "../context/MedicationContext.jsx";
import { NotificationContext } from "../context/NotificationContext.jsx";
import ReminderCard from "../components/ReminderCard.jsx";
import MedicationCard from "../components/MedicationCard.jsx";
import "../styles/HomePage.css"
function HomePage() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

const {
  medications,
  markTaken,
  snoozeMedication,
  removeMedication,
  updateMedication,
} = useContext(MedicationContext);

  const { notifications } = useContext(NotificationContext);

  const upcomingNotifications = notifications.filter(
    (item) => item.status === "upcoming"
  );

  const takenCount = medications.filter((item) => item.taken).length;

  const firstName = user?.fullName?.split(" ")[0] || "Friend";

  return (
    <main className="page page--home">

      {/* HERO */}

      <section className="panel panel--hero">

        <div className="hero-top">

          <div className="hero-content">

            <p className="panel__eyebrow">
              Good Day 👋
            </p>

            <h1 className="panel__title">
              Hello, {firstName}
            </h1>

            <p className="panel__subtitle">
              Your gentle reminders are ready for today.
            </p>

          </div>

          <div className="hero-pill">
            ✓ On Track
          </div>

        </div>

      </section>

      {/* STATISTICS */}

      <section className="panel panel--stats">

        <div className="stat-card">
          <p className="stat-card__value">
            {medications.length}
          </p>

          <p className="stat-card__label">
            Medications
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-card__value">
            {upcomingNotifications.length}
          </p>

          <p className="stat-card__label">
            Upcoming
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-card__value">
            {takenCount}
          </p>

          <p className="stat-card__label">
            Taken
          </p>
        </div>

      </section>

      {/* TODAY'S MEDICATION */}

      <section className="panel">

        <div className="panel__header">
          <h2>Today's Medication</h2>
        </div>

        <div className="home__list">

          {medications.length > 0 ? (

            medications.slice(0, 3).map((medication) => (

              <ReminderCard
                key={medication.id}
                reminder={medication}
                onMarkTaken={markTaken}
                onSnooze={snoozeMedication}
              />

            ))

          ) : (

            <p className="empty-state">

              No medication available.

            </p>

          )}

        </div>

      </section>

      {/* QUICK ACTIONS */}

      <section className="panel panel--actions">

        <h2>Quick Actions</h2>

        <div className="action-grid">

          <button
            className="button button--secondary button--large"
            onClick={() => navigate("/medications")}
          >
            💊 Manage Medication
          </button>

          <button
            className="button button--secondary button--large"
            onClick={() => navigate("/calendar")}
          >
            📅 Calendar
          </button>

          <button
            className="button button--secondary button--large"
            onClick={() => navigate("/notifications")}
          >
            🔔 Alerts
          </button>

          <button
            className="button button--secondary button--large"
            onClick={() => navigate("/family")}
          >
            ❤️ Support
          </button>

        </div>

      </section>

      {/* SUPPORT */}

      <section className="panel panel--support">

        <div>

          <h2>Need Help?</h2>

          <p className="panel__subtitle">
            Chat with the AI assistant or contact your caregiver.
          </p>

        </div>

        <button
          className="button button--primary"
          onClick={() => navigate("/family")}
        >
          Get Support
        </button>

      </section>

      {/* SUMMARY */}

      <section className="panel">

        <div className="panel__header">
          <h2>Medication Summary</h2>
        </div>

        <div className="home__list">

          {medications.slice(0, 2).map((medication) => (

              <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={updateMedication}
              onDelete={removeMedication}
              />

          ))}

        </div>

      </section>

    </main>
  );
}

export default HomePage;