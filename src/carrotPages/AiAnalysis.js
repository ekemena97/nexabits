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
      className="ai-container font-inter"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full -mt-1 text-center px-5">
        <img src={animation2} alt="Animation" className="-mb-1 w-20 h-20" />
        <h1 className="ai-title text-xl font-bold mb-4">AI Technical Analysis</h1>
        {showIntro ? (
          <p className="text-base mb-6 px-3">Hey there! I'm your AI expert, ready to guide you on your crypto journey with insightful market analysis and tips.</p>
        ) : (
          <p className="text-base mb-6 px-3">✨Leveraging billions of data points from CoinMarketCap and CoinGecko, fine-tuned with OpenAI datasets for precise insights.</p>
        )}
        <CryptoAnalysis onFetchAnalysis={handleFetchAnalysis} />
      </div>
    </div>
  );
};

export default AiAnalysis;
