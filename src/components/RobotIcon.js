import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './robotIcon.css'; // Import the CSS file for styling
import robotGif from '../assets/animation1.gif'; // Import your GIF file

const texts = [
  "Bitcoin price prediction today",
  "Let us analyze the market together",
  "Hello, I am your personal crypto AI guide",
  "How can I help you?",
  "Click Me, let's do Technical analysis",
  "Let me guide you on your crypto journey",
  "Powered by billions of data from CoinMarketcap",
  "Learn to make smarter market decisions",
  "Let's find the best Buy position",
  "Let's spot the best sell positions powered by AI",
  "Where should the stop loss be? Let's find out",
  "Where would BTC touch today? Let's find out",
  "Will market be bullish today?",
  "Will the market turn bearish today?",
  "What is the current market sentiment?",
  "What altcoin looks good now?",
  "What altcoin has high potential this year?",
  "Always do your own Research 🫵"
];

const RobotIcon = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const typingTimeoutRef = useRef(null);
  const visibilityTimeoutRef = useRef(null);
  const cycleTimeoutRef = useRef(null);

  useEffect(() => {
    const getRandomText = () => texts[Math.floor(Math.random() * texts.length)];

    const typeText = async (text) => {
      setDisplayedText(""); // Clear previous text before typing new text
      for (let i = 0; i < text.length; i++) {
        await new Promise((resolve) => {
          typingTimeoutRef.current = setTimeout(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            resolve();
          }, 100); // Adjust typing speed here
        });
      }
    };

    const startTextCycle = async () => {
      if (isVisible) {
        const firstText = getRandomText();
        await typeText(firstText);

        await new Promise((resolve) => {
          cycleTimeoutRef.current = setTimeout(async () => {
            const secondText = getRandomText();
            await typeText(secondText);

            cycleTimeoutRef.current = setTimeout(() => {
              setIsVisible(false); // Hide text after the second text
            }, 20000); // Display second text for 20 seconds
            resolve();
          }, 20000); // Display first text for 20 seconds
        });
      }
    };

    const cycleVisibility = async () => {
      if (!isVisible) {
        setIsVisible(true);
        await startTextCycle();
      } else {
        visibilityTimeoutRef.current = setTimeout(() => {
          cycleVisibility();
        }, 120000); // 2 minutes (120,000 ms) before showing the next random text cycle
      }
    };

    startTextCycle();

    const visibilityInterval = setInterval(() => {
      cycleVisibility();
    }, 60000); // 1 minute

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      clearInterval(visibilityInterval);
    };
  }, [isVisible]);

  const handleClick = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    localStorage.setItem('lastClicked', new Date().getTime());
    navigate('/ai');
  };

  return (
    <div className="robot-icon" onClick={handleClick} style={{ position: 'relative' }}>
      <img src={robotGif} alt="Robot Icon" className="robot-gif" />
      <div className="red-dot"></div>
      {isVisible && <div className="notification-text">{displayedText}</div>}
    </div>
  );
};

export default RobotIcon;
