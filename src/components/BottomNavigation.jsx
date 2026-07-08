import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/bottom-navigation.css";

function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className="bottom-nav__link">
        <span>🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink to="/calendar" className="bottom-nav__link">
        <span>📅</span>
        <span>Calendar</span>
      </NavLink>

      <NavLink to="/medications" className="bottom-nav__link">
        <span>➕</span>
        <span>Add</span>
      </NavLink>

      <NavLink to="/notifications" className="bottom-nav__link">
        <span>🔔</span>
        <span>Alerts</span>
      </NavLink>

      <NavLink to="/profile" className="bottom-nav__link">
        <span>👤</span>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;