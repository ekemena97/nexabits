// src/pages/AiAnalysis.js
import React from 'react';
import CryptoAnalysis from '../components/CryptoAnalysis.js';
import '../components/ai.css'; // Import the CSS file

const AiAnalysis = () => {
  return (
    <div className="ai-container">
      <h1 className="ai-title">AI Technical Analysis</h1>
      <CryptoAnalysis />
    </div>
  );
};

export default AiAnalysis;
