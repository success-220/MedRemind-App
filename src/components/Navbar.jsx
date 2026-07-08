import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        

        <Link to="/home" className="navbar__title">
          MedRemind
        </Link>
      </div>

      <nav className="navbar__menu">
        <Link
          to="/notifications"
          className="navbar__link"
          aria-label="Notifications"
        >
          🔔
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;