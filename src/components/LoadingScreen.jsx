import React from 'react';
import '../styles/loading.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" aria-hidden="true"></div>
      <p className="loading-screen__text">Loading MedRemind...</p>
    </div>
  );
}

export default LoadingScreen;
