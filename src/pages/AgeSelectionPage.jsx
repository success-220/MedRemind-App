import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ageSelection.css";

function AgeSelectionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <main className="age-selection">
      <div className="age-selection__container">

        {/* Images */}
        <div className="age-selection__images">
          <img
            src="/images/elderly1.png"
            alt="Senior Man"
            className="age-selection__img"
          />

          <img
            src="/images/elderly2.png"
            alt="Senior Woman"
            className="age-selection__img"
          />
        </div>

        <h1 className="age-selection__title">
          Choose Your Age Group
        </h1>

        <p className="age-selection__subtitle">
          Select the age group that best describes you.
        </p>

        <button
          className={`age-card ${
            selected === "senior" ? "selected" : ""
          }`}
          onClick={() => setSelected("senior")}
        >
          <h3>Senior Adult</h3>
          <span>65 – 80 Years</span>
        </button>

        <button
          className={`age-card ${
            selected === "middle" ? "selected" : ""
          }`}
          onClick={() => setSelected("middle")}
        >
          <h3>Middle Aged</h3>
          <span>50 – 65 Years</span>
        </button>

        <div className="age-buttons">
          <button
            className="skip-btn"
            onClick={() => navigate("/login")}
          >
            Skip
          </button>

          <button
            className="next-btn"
            disabled={!selected}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>

      </div>
    </main>
  );
}

export default AgeSelectionPage;