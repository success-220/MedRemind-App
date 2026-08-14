import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";

function OnboardingPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem("medremind_onboarded", "true");
    navigate("/age-selection");
  };

  return (
    <main className="onboarding">
      <div className="onboarding__content">

        <div className="onboarding__image">
          <img
            src="/images/onboarding.png"   
            alt="Medication Reminder"
          />
        </div>

        <h1 className="onboarding__title">
          Stay Healthy and Never Miss Your Medication
        </h1>

        <p className="onboarding__subtitle">
          MedRemind helps to take their medication on time with
          simple reminders, health tracking, and caring support.
        </p>

        <div className="onboarding__actions">
          <button
            className="button button--secondary"
            onClick={handleContinue} 
          >
            Skip
          </button>

          <button
            className="button button--primary"
            onClick={handleContinue} 
          >
            Next
          </button>
        </div>

      </div>
    </main>
  );
}

export default OnboardingPage;