import React, { useState } from 'react';
import './Campaigns.css';

export const handleDailyCheckIn = () => {
  const dailyOpenCount = parseInt(localStorage.getItem('dailyOpenCount')) || 1;
  const consecutiveOpenCount = parseInt(localStorage.getItem('consecutiveOpenCount')) || 1;
  const consecutiveOpenDays = parseInt(localStorage.getItem('consecutiveOpenDays')) || 0;

  const lastOpenCheckIn = localStorage.getItem('task2_lastClaimTime');
  const now = new Date().getTime();
  const twelveHours = 12 * 60 * 60 * 1000;  // 12 hours in milliseconds
  const twentyFourHours = 24 * 60 * 60 * 1000;  // 24 hours in milliseconds

  if (lastOpenCheckIn) {
    const timeDifference = now - parseInt(lastOpenCheckIn);

    if (timeDifference >= twelveHours && timeDifference < twentyFourHours) {
      const newDailyOpenCount = dailyOpenCount + 1;
      localStorage.setItem('dailyOpenCount', newDailyOpenCount);

      const newConsecutiveOpenDays = consecutiveOpenDays + 1;
      localStorage.setItem('consecutiveOpenDays', newConsecutiveOpenDays);

      if (newConsecutiveOpenDays % 2 === 0) {
        const newConsecutiveOpenCount = consecutiveOpenCount + 1;
        localStorage.setItem('consecutiveOpenCount', newConsecutiveOpenCount);
      }
    } else if (timeDifference >= twentyFourHours) {
      console.log("Streak broken. No increment to consecutiveOpenDays.");
    }
  } else {
    localStorage.setItem('dailyOpenCount', 1);
    localStorage.setItem('consecutiveOpenDays', 0);
  }

  localStorage.setItem('lastOpenCheckIn', now);
};

const Campaigns = () => {
  const [dailyOpenCount] = useState(() => parseInt(localStorage.getItem('dailyOpenCount')) || 1);
  const [consecutiveOpenCount] = useState(() => parseInt(localStorage.getItem('consecutiveOpenCount')) || 1);

  return (
    <div className="campaigns-container">
      <div className="campaigns">
        <div className="campaign active">
          <span className="emojila">⚡</span>
          <span>Active</span>
          <span className="counting">{consecutiveOpenCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
