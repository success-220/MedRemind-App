import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash">
      <div className="splash__content">

        <h1 className="splash__title">MED REMIND</h1>

       

        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </main>
  );
}

export default SplashPage;