// ClaimContext.js
import React, { createContext, useState, useEffect } from "react";

export const ClaimContext = createContext();

export const ClaimProvider = ({ children }) => {
  const DAILY_POINTS = 10;
  const BONUS_POINTS = 200;
  const COOLDOWN_HOURS = 12;
  const TOTAL_DAYS = 10;

  const [daysVisited, setDaysVisited] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const savedDaysVisited = parseInt(localStorage.getItem("task2_daysVisited")) || 0;
    const savedLastClaimTime = localStorage.getItem("task2_lastClaimTime");
    const savedClaimedFlag = localStorage.getItem("task2_claimed") === "true";
    const savedBonusUnlocked = localStorage.getItem("task2_bonusUnlocked") === "true";

    setDaysVisited(savedDaysVisited);
    setBonusUnlocked(savedBonusUnlocked);

    const currentTime = Date.now();

    if (savedClaimedFlag) {
      setCanClaim(false);
      const timeSinceClaim = currentTime - parseInt(savedLastClaimTime);
      if (timeSinceClaim < COOLDOWN_HOURS * 60 * 60 * 1000) {
        setRemainingTime(COOLDOWN_HOURS * 60 * 60 * 1000 - timeSinceClaim);
      } else {
        setCanClaim(true);
        setRemainingTime(0);
      }
    } else {
      setCanClaim(true);
    }

    setLastClaimDate(savedLastClaimTime ? new Date(parseInt(savedLastClaimTime)).toDateString() : null);
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            setCanClaim(true);
            setRemainingTime(0);
            localStorage.removeItem("task2_lastClaimTime");
            localStorage.removeItem("task2_claimed");
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const claimPoints = (incrementPoints, markTaskAsCompleted, onCompletion) => {
    const currentTime = Date.now();
    const newDaysVisited = daysVisited >= TOTAL_DAYS ? 1 : daysVisited + 1;

    setDaysVisited(newDaysVisited);
    setLastClaimDate(new Date().toDateString());
    setCanClaim(false);

    localStorage.setItem("task2_lastClaimTime", currentTime.toString());
    localStorage.setItem("task2_daysVisited", newDaysVisited);
    localStorage.setItem("task2_claimed", "true");

    incrementPoints(DAILY_POINTS);

    if (newDaysVisited === TOTAL_DAYS) {
      markTaskAsCompleted("task-2");
      incrementPoints(BONUS_POINTS);
      setBonusUnlocked(true);
      localStorage.setItem("task2_bonusUnlocked", "true");
      onCompletion(true);
    }

    const timeRemaining = COOLDOWN_HOURS * 60 * 60 * 1000;
    setRemainingTime(timeRemaining);
  };

  const resetBonus = () => {
    setBonusUnlocked(false);
    localStorage.removeItem("task2_bonusUnlocked");
  };

  return (
    <ClaimContext.Provider
      value={{
        daysVisited,
        canClaim,
        bonusUnlocked,
        remainingTime,
        claimPoints,
        resetBonus,
        TOTAL_DAYS,
        DAILY_POINTS,
        BONUS_POINTS,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
};
