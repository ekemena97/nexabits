import React, { useState, useEffect } from 'react';
import './DailyCheckIn.css';
import { FaCoins, FaCheckCircle } from 'react-icons/fa';
import { handleDailyCheckIn } from '../components/Campaigns.js';

const rewards = [
  { day: 1, amount: '50' },
  { day: 2, amount: '100' },
  { day: 3, amount: '300' },
  { day: 4, amount: '700' },
  { day: 5, amount: '1K' },
  { day: 6, amount: '5K' },
  { day: 7, amount: '15K' },
  { day: 8, amount: '30K' },
  { day: 9, amount: '50K' },
  { day: 10, amount: '100K' },
];

const getNextDay = (currentDay) => (currentDay % 10) + 1;

const DailyCheckIn = ({ onClose, onClaimReward, onCheckIn }) => {
  const [claimedDays, setClaimedDays] = useState(JSON.parse(localStorage.getItem('claimedRewardDays')) || []);
  const [currentDay, setCurrentDay] = useState(parseInt(localStorage.getItem('currentRewardDay')) || 1);
  const [canClaim, setCanClaim] = useState(true);
  const [timer, setTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const endTime = localStorage.getItem('rewardEndTime');
    const resetEndTime = localStorage.getItem('resetRewardEndTime');
    
    if (endTime) {
      const remainingTime = new Date(endTime) - new Date();
      if (remainingTime > 0) {
        setCanClaim(false);
        setTimer(remainingTime);
        startClaimTimer(remainingTime);
      } else {
        handleClaimTimerEnd();
      }
    }

    if (resetEndTime) {
      const remainingResetTime = new Date(resetEndTime) - new Date();
      if (remainingResetTime > 0) {
        startResetTimer(remainingResetTime);
      } else {
        handleResetTimerEnd();
      }
    }
  }, []);

  const startClaimTimer = (remainingTime) => {
    const timerId = setInterval(() => {
      const newRemainingTime = remainingTime - 1000;
      if (newRemainingTime <= 0) {
        clearInterval(timerId);
        handleClaimTimerEnd();
      } else {
        setTimer(newRemainingTime);
        remainingTime = newRemainingTime;
      }
    }, 1000);
  };

  const handleClaimTimerEnd = () => {
    const nextDay = getNextDay(currentDay);
    setCurrentDay(nextDay);
    setCanClaim(true);
    localStorage.setItem('currentRewardDay', nextDay);
    localStorage.removeItem('rewardEndTime');
    if (nextDay === 1) {
      setClaimedDays([]);
      localStorage.removeItem('claimedRewardDays');
    }
    const resetEndTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    localStorage.setItem('resetRewardEndTime', resetEndTime);
    startResetTimer(24 * 60 * 60 * 1000);
  };

  const startResetTimer = (remainingResetTime) => {
    const resetTimerId = setInterval(() => {
      const newRemainingResetTime = remainingResetTime - 1000;
      if (newRemainingResetTime <= 0) {
        clearInterval(resetTimerId);
        handleResetTimerEnd();
      } else {
        remainingResetTime = newRemainingResetTime;
      }
    }, 1000);
  };

  const handleResetTimerEnd = () => {
    setCurrentDay(1);
    setClaimedDays([]);
    setCanClaim(true);
    localStorage.setItem('currentRewardDay', 1);
    localStorage.removeItem('claimedRewardDays');
    localStorage.removeItem('resetRewardEndTime');
  };

  const handleClaim = () => {
  if (canClaim) {
    const newClaimedDays = [...claimedDays, currentDay];
    setClaimedDays(newClaimedDays);
    localStorage.setItem('claimedRewardDays', JSON.stringify(newClaimedDays));

    const endTime = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
    localStorage.setItem('rewardEndTime', endTime);

    setCanClaim(false);
    startClaimTimer(12 * 60 * 60 * 1000);

    const rewardAmount = convertToPoints(rewards.find(reward => reward.day === currentDay).amount);
    onClaimReward(rewardAmount);
    handleDailyCheckIn();  // Trigger the daily and consecutive checkin counter from the Campaigns.js

    if (onCheckIn) {
      onCheckIn();  // Notify Tap.js to re-render
    }

    // Trigger haptic feedback
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');  // Medium impact feedback
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1000); // Display success message for 1 second

    localStorage.removeItem('resetRewardEndTime');
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
    localStorage.setItem('claimedRewardDays', JSON.stringify(claimedDays));
    localStorage.setItem('currentRewardDay', currentDay);
  }, [claimedDays, currentDay]);

  const formatTime = (milliseconds) => {
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="daily-check-in-overlay">
      <div className="daily-check-in">
        <div className="header">
          <h2>Daily reward</h2>
          <p>Get Reward for Opening the App Daily</p>
          <button className="close-button" onClick={() => !showSuccess && onClose()}>X</button>
        </div>
        {showSuccess && (
          <div className="success-message">Success 🎉</div>
        )}
        <div className={`content ${showSuccess ? 'blur' : ''}`}>
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
    </div>
  );
};

export default DailyCheckIn;
