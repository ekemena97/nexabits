import React, { useState, useEffect } from 'react';
import CryptoAnalysis from '../components/CryptoAnalysis.js';
import '../components/ai.css'; // Import the CSS file
import animation2 from '../assets/animation2.gif'; // Import the GIF file
import backgroundImage from '../assets/bg-main.png'; // Import the background image
import { useTreasureContext } from "../context/treasureContext.js";

const AiAnalysis = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [pointAdded, setPointAdded] = useState(false);
  const { addTreasurePoint } = useTreasureContext();

  useEffect(() => {
    if (!showIntro && !pointAdded) {
      addTreasurePoint();
      setPointAdded(true);
    }
  }, [showIntro, pointAdded, addTreasurePoint]);

  const handleFetchAnalysis = () => setShowIntro(false);

  return (
    <div
      className="ai-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', // Center text content
        padding: '20px' // Add some padding to avoid content touching the edges
      }}
    >
      <img src={animation2} alt="Animation" style={{ marginBottom: '20px' }} />
      <h1 className="ai-title">AI Technical Analysis</h1>
      {showIntro ? (
        <p>Hey there! I'm your AI expert, ready to guide you on your crypto journey with insightful market analysis and tips.</p>
      ) : (
        <p>✨Leveraging billions of data points from CoinMarketCap and CoinGecko, fine-tuned with OpenAI datasets for precise insights.</p>
      )}
      <CryptoAnalysis onFetchAnalysis={handleFetchAnalysis} />
    </div>
  );
};

export default AiAnalysis;
