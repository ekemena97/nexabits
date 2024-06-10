import React, { useState, useEffect } from 'react';
import './DailyCheckIn.css';
import { FaCoins, FaCheckCircle } from 'react-icons/fa'; // Import the coin and checkmark icons

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

const getNextDay = (currentDay) => (currentDay % 10) + 1;

const DailyCheckIn = ({ onClose, onClaimReward }) => {
  const [claimedDays, setClaimedDays] = useState(JSON.parse(localStorage.getItem('claimedDays')) || []);
  const [currentDay, setCurrentDay] = useState(parseInt(localStorage.getItem('currentDay')) || 1);
  const [canClaim, setCanClaim] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const endTime = localStorage.getItem('endTime');
    if (endTime) {
      const remainingTime = new Date(endTime) - new Date();
      if (remainingTime > 0) {
        setCanClaim(false);
        setTimer(remainingTime);
        const timerId = setInterval(() => {
          const newRemainingTime = new Date(endTime) - new Date();
          if (newRemainingTime <= 0) {
            clearInterval(timerId);
            setCanClaim(true);
            localStorage.removeItem('endTime');
            // Update UI when time ends
            const nextDay = getNextDay(currentDay);
            setCurrentDay(nextDay);
            localStorage.setItem('currentDay', nextDay);
            if (nextDay === 1) {
              setClaimedDays([]);
              localStorage.removeItem('claimedDays');
            }
          } else {
            setTimer(newRemainingTime);
          }
        }, 1000);
        return () => clearInterval(timerId);
      }
    }
  }, [currentDay]);

  const handleClaim = () => {
    if (canClaim) {
      const newClaimedDays = [...claimedDays, currentDay];
      setClaimedDays(newClaimedDays);
      localStorage.setItem('claimedDays', JSON.stringify(newClaimedDays));

      const endTime = new Date(new Date().getTime() + 120000); // 2 minutes from now
      localStorage.setItem('endTime', endTime);

      setCanClaim(false);
      setTimer(120000);
      const timerId = setInterval(() => {
        const remainingTime = new Date(endTime) - new Date();
        if (remainingTime <= 0) {
          clearInterval(timerId);
          const nextDay = getNextDay(currentDay);
          setCurrentDay(nextDay);
          setCanClaim(true);
          localStorage.setItem('currentDay', nextDay);
          localStorage.removeItem('endTime');
          if (nextDay === 1) {
            setClaimedDays([]);
            localStorage.removeItem('claimedDays');
          }
        } else {
          setTimer(remainingTime);
        }
      }, 1000);

      const rewardAmount = convertToPoints(rewards.find(reward => reward.day === currentDay).amount);
      onClaimReward(rewardAmount); // Call the callback to update points

      setTimeout(onClose, 4000); // Close the page after 4 seconds
    }
  };

  const convertToPoints = (amount) => {
    const unit = amount.slice(-1);
    const value = parseFloat(amount.slice(0, -1));
    switch (unit) {
      case 'K':
        return value * 1000;
      case 'M':
        return value * 1000000;
      default:
        return parseInt(amount, 10);
    }
  };

  useEffect(() => {
    localStorage.setItem('claimedDays', JSON.stringify(claimedDays));
    localStorage.setItem('currentDay', currentDay);
  }, [claimedDays, currentDay]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // New effect to check and update state periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      const endTime = localStorage.getItem('endTime');
      if (endTime) {
        const remainingTime = new Date(endTime) - new Date();
        if (remainingTime <= 0) {
          const nextDay = getNextDay(currentDay);
          setCurrentDay(nextDay);
          setCanClaim(true);
          localStorage.setItem('currentDay', nextDay);
          localStorage.removeItem('endTime');
          if (nextDay === 1) {
            setClaimedDays([]);
            localStorage.removeItem('claimedDays');
          }
        } else {
          setTimer(remainingTime);
          setCanClaim(false);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentDay]);

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
            <div
              key={index}
              className={`reward ${reward.day === currentDay ? 'reward-day-1' : ''} ${claimedDays.includes(reward.day) ? 'reward-day-1-claimed' : ''} ${index < 8 ? 'active' : ''}`}
            >
              <div className="day">Day {reward.day}</div>
              <div className="amount">
                {reward.amount} <FaCoins className="coin-icon" />
              </div>
              {claimedDays.includes(reward.day) && (
                <FaCheckCircle className="checkmark-icon" />
              )}
            </div>
          ))}
        </div>
        <div className="footer">
          <button onClick={handleClaim} disabled={!canClaim} className={canClaim ? '' : 'disabled-button'}>
            {canClaim ? 'Claim Reward' : `Claim More in (${formatTime(timer)})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
