import React, { useState, useEffect } from 'react';
import CryptoAnalysis from '../components/CryptoAnalysis.js';
import '../components/ai.css'; // Import the CSS file
import animation2 from '../assets/animation2.gif'; // Import the GIF file
import { useTreasureContext } from "../context/treasureContext.js";
import { useThemeContext } from "../context/ThemeContext.js";

const AiAnalysis = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [pointAdded, setPointAdded] = useState(false);
  const { addTreasurePoint } = useTreasureContext();
  const { theme } = useThemeContext();

  useEffect(() => {
    if (showIntro === false && pointAdded === false) {
      console.log("Calling addTreasurePoint");
      addTreasurePoint();
      setPointAdded(true);
    }
  }, [showIntro, pointAdded, addTreasurePoint]);

  const handleFetchAnalysis = () => {
    if (showIntro) {
      console.log("Setting showIntro to false");
      setShowIntro(false);
    }
  };

  return (
    <div className={`ai-container ${
        theme === "dark"
          ? "bg-[#19191E] text-[#fff]"
          : "bg-[#fff] text-[#19191E]"
      }`}
    >
      <div className="gif-container">
        <img src={animation2} alt="Animation" />
      </div>
      <h1 className="ai-title">AI Technical Analysis</h1>
      <div className="ai-intro">
        {showIntro && (
          <p>Hey there! I'm your AI expert, ready to guide you on your crypto journey with insightful market analysis and tips.</p>
        )}
        <p>Leveraging billions of data points from CoinMarketCap and CoinGecko, fine-tuned with OpenAI datasets for precise insights.</p>
      </div>
      <CryptoAnalysis onFetchAnalysis={handleFetchAnalysis} />
    </div>
  );
};

export default AiAnalysis;
