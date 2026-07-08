import React from 'react';
import '../styles/card.css';

function NotificationCard({ notification }) {
  return (
    <article className={`card card--notification card--${notification.status}`}>
      <p className="card__text">{notification.title}</p>
      <span className="card__badge">{notification.status}</span>
    </article>
  );
}

export default NotificationCard;
