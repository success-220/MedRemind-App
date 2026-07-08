import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext.jsx";
import NotificationCard from "../components/NotificationCard.jsx";
import "../styles/NotificationsPage.css";
import "../styles/Pages.css";

function NotificationsPage() {
  const {
    notifications,
    markCompleted,
    clearNotifications,
  } = useContext(NotificationContext);

  const upcoming = notifications.filter(
    (notification) => notification.status === "upcoming"
  );

  const missed = notifications.filter(
    (notification) => notification.status === "missed"
  );

  const completed = notifications.filter(
    (notification) => notification.status === "completed"
  );

  return (
    <main className="page page--notifications">

      {/* HERO */}

      <section className="panel panel--hero">

        <div className="hero-top">

          <div className="hero-content">

            <h1 className="panel__title">
              🔔 Notification Center
            </h1>

            <p className="panel__subtitle">
              Stay updated with your medication reminders.
            </p>

          </div>

          <div className="hero-pill">
            {notifications.length} Notifications
          </div>

        </div>

      </section>

      {/* SUMMARY */}

      <section className="notification-summary">

        <div className="summary-card">
          <h3>{upcoming.length}</h3>
          <p>Upcoming</p>
        </div>

        <div className="summary-card summary-card--orange">
          <h3>{missed.length}</h3>
          <p>Missed</p>
        </div>

        <div className="summary-card summary-card--green">
          <h3>{completed.length}</h3>
          <p>Completed</p>
        </div>

      </section>

      {/* UPCOMING */}

      <section className="panel">

        <div className="panel__header">

          <h2>🔔 Upcoming Reminders</h2>

          <button
            className="button button--secondary"
            onClick={clearNotifications}
          >
            Clear All
          </button>

        </div>

        <div className="card-list">

          {upcoming.length > 0 ? (

            upcoming.map((item) => (

              <div
                className="notification-row upcoming"
                key={item.id}
              >

                <NotificationCard notification={item} />

                <button
                  className="button button--primary"
                  onClick={() => markCompleted(item.id)}
                >
                  ✓ Mark Done
                </button>

              </div>

            ))

          ) : (

            <div className="empty-box">

              <h3>No Upcoming Reminders</h3>

              <p>You're all caught up.</p>

            </div>

          )}

        </div>

      </section>

      {/* MISSED */}

      <section className="panel">

        <div className="panel__header">
          <h2>⚠️ Missed Reminders</h2>
        </div>

        <div className="card-list">

          {missed.length > 0 ? (

            missed.map((item) => (

              <div
                className="notification-row missed"
                key={item.id}
              >

                <NotificationCard notification={item} />

              </div>

            ))

          ) : (

            <div className="empty-box">

              <h3>Excellent!</h3>

              <p>No missed medications today.</p>

            </div>

          )}

        </div>

      </section>

      {/* COMPLETED */}

      <section className="panel">

        <div className="panel__header">
          <h2>✅ Completed Reminders</h2>
        </div>

        <div className="card-list">

          {completed.length > 0 ? (

            completed.map((item) => (

              <div
                className="notification-row completed"
                key={item.id}
              >

                <NotificationCard notification={item} />

              </div>

            ))

          ) : (

            <div className="empty-box">

              <h3>No Completed Medications</h3>

              <p>Your completed reminders will appear here.</p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default NotificationsPage;