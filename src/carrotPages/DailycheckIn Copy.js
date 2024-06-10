import React from 'react';
import './DailyCheckIn.css';
import { FaCoins } from 'react-icons/fa'; // Import the coin icon from react-icons

const rewards = [
  { day: 1, amount: '500' },
  { day: 2, amount: '1K' },
  { day: 3, amount: '2.5K' },
  { day: 4, amount: '5K' },
  { day: 5, amount: '15K' },
  { day: 6, amount: '25K' },
  { day: 7, amount: '100K' },
  { day: 8, amount: '500K' },
  { day: 9, amount: '1M' },
  { day: 10, amount: '5M' },
];

const DailyCheckIn = ({ onClose }) => {
  return (
    <div className="daily-check-in-overlay">
      <div className="daily-check-in">
        <div className="header">
          <h2>Daily reward</h2>
          <p>Get Reward for Opening the App Daily</p>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="rewards-grid">
          {rewards.map((reward, index) => (
            <div key={index} className={`reward ${index < 8 ? 'active' : ''}`}>
              <div className="day">Day {reward.day}</div>
              <div className="amount">
                {reward.amount} <FaCoins className="coin-icon" />
              </div>
            </div>
          ))}
        </div>
        <div className="footer">
          <button onClick={onClose}>Claim Reward</button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
