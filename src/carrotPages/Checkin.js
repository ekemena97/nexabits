import React, { useState, useEffect } from 'react';
import './Checkin.css';

const Checkin = ({ onClose, onClaim }) => {
  const [day, setDay] = useState(1);
  const [claimed, setClaimed] = useState(false);
  const [timer, setTimer] = useState(0);

  const rewards = [300, 700, 2000, 5000, 12000, 20000, 50000, 150000, 500000, 1000000];

  useEffect(() => {
    const storedDay = localStorage.getItem('checkinDay');
    const lastClaimTime = localStorage.getItem('lastClaimTime');
    if (storedDay) setDay(parseInt(storedDay, 10));

    if (lastClaimTime) {
      const elapsed = Date.now() - parseInt(lastClaimTime, 10);
      if (elapsed < 86400000) {
        setTimer(86400000 - elapsed);
        setClaimed(true);
      }
    }
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1000);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleClaim = () => {
    onClaim(rewards[day - 1]);
    setClaimed(true);
    setTimer(86400000);
    localStorage.setItem('checkinDay', day < 10 ? day + 1 : 1);
    localStorage.setItem('lastClaimTime', Date.now());
    setDay((prev) => (prev < 10 ? prev + 1 : 1));
    setTimeout(() => {
      setClaimed(false);
    }, 5000);
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="checkin-modal">
      <div className="checkin-content">
        <h2>Daily Reward</h2>
        <p>Accrue coins for logging into the game daily without skipping</p>
        <div className="rewards-grid">
          {rewards.map((reward, index) => (
            <div key={index} className={`reward ${day === index + 1 ? 'active' : ''}`}>
              <p>Day {index + 1}</p>
              <p>{reward}</p>
            </div>
          ))}
        </div>
        {claimed ? (
          <button disabled>
            {timer > 0 ? formatTime(timer) : 'Claim'}
          </button>
        ) : (
          <button onClick={handleClaim}>Claim</button>
        )}
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Checkin;
