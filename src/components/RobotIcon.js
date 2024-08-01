import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './robotIcon.css'; // Import the CSS file for styling
import robotGif from '../assets/animation1.gif'; // Import your GIF file

const texts = [
  "Bitcoin price prediction today",
  "Let us analyze the market together",
  "Hello, I am your personal crypto AI guide",
  "How can I help you?",
  "Click Me, let us do Technical analysis together",
  "I can guide you on your crypto journey",
  "Powered by billions of data from CoinMarketcap & Coingecko",
  "I can help you to make smarter market decisions",
  "I can spot the best Buy position",
  "I can spot the best sell positions powered by AI",
  "Where should you put the stop loss? Let us find out",
  "Where would BTC likely touch today? Let us find out",
  "Will market be bullish today?",
  "Will the market turn bearish today?",
  "What is the current market sentiment today?",
  "What altcoin looks good now?",
  "What altcoin has high potential this year?",
  "Always do your own Research 🫵"
];

const RobotIcon = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const getRandomText = () => texts[Math.floor(Math.random() * texts.length)];

    const typeText = (text, index = 0) => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        typingTimeoutRef.current = setTimeout(() => typeText(text, index + 1), 100); // Adjust typing speed here
      } else {
        typingTimeoutRef.current = setTimeout(() => {
          setDisplayedText(""); // Clear the displayed text
          startTypingEffect(); // Start typing the next text
        }, 60000); // Change text every 1 minute
      }
    };

    const startTypingEffect = () => {
      setDisplayedText(""); // Ensure text is cleared before starting
      const text = getRandomText();
      typeText(text);
    };

    startTypingEffect();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }; // Clean up timeout on unmount
  }, []);

  const handleClick = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    localStorage.setItem('lastClicked', new Date().getTime());
    navigate('/ai');
  };

  return (
    <div className="robot-icon" onClick={handleClick} style={{ position: 'relative' }}>
      <img src={robotGif} alt="Robot Icon" className="robot-gif" />
      <div className="red-dot"></div>
      <div className="notification-text">{displayedText}</div>
    </div>
  );
};

export default RobotIcon;
