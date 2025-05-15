import React, { createContext, useState, useEffect } from "react";
import { useTelegramUser } from "./TelegramContext.js"; // Import the hook to get Telegram user ID

export const ClaimContext = createContext();

export const ClaimProvider = ({ children }) => {
  const DAILY_POINTS = 10;
  const BONUS_POINTS = 200;
  const COOLDOWN_HOURS = 12;
  const TOTAL_DAYS = 10;

  const userId = useTelegramUser(); // Get Telegram userId
  const isTelegramWebApp = !!userId; // Determine if the user is in Telegram WebApp

  const [daysVisited, setDaysVisited] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  const fetchData = async () => {
    if (isTelegramWebApp) {
      // Fetch data from Firestore
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        
        setDaysVisited(userData.daysVisited || 0);
        setBonusUnlocked(userData.bonusUnlocked || false);
        setLastClaimDate(userData.lastClaimDate || null);

        const currentTime = Date.now();
        if (userData.lastClaimTime) {
          const timeSinceClaim = currentTime - parseInt(userData.lastClaimTime);
          if (timeSinceClaim < COOLDOWN_HOURS * 60 * 60 * 1000) {
            setCanClaim(false);
            setRemainingTime(COOLDOWN_HOURS * 60 * 60 * 1000 - timeSinceClaim);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      // Fetch data from localStorage
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
      }
      setLastClaimDate(savedLastClaimTime ? new Date(parseInt(savedLastClaimTime)).toDateString() : null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, isTelegramWebApp]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            setCanClaim(true);
            setRemainingTime(0);
            if (!isTelegramWebApp) {
              localStorage.removeItem("task2_lastClaimTime");
              localStorage.removeItem("task2_claimed");
            }
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const saveData = async (data) => {
    if (isTelegramWebApp) {
      // Save data to Firestore
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Error saving data to Firestore:", error);
      }
    } else {
      // Save data to localStorage
      localStorage.setItem("task2_daysVisited", data.daysVisited);
      localStorage.setItem("task2_lastClaimTime", data.lastClaimTime);
      localStorage.setItem("task2_claimed", data.claimed);
      if (data.bonusUnlocked !== undefined) {
        localStorage.setItem("task2_bonusUnlocked", data.bonusUnlocked);
      }
    }
  };

  const claimPoints = async (incrementPoints, markTaskAsCompleted, onCompletion) => {
    const currentTime = Date.now();
    const newDaysVisited = daysVisited >= TOTAL_DAYS ? 1 : daysVisited + 1;

    setDaysVisited(newDaysVisited);
    setLastClaimDate(new Date().toDateString());
    setCanClaim(false);

    incrementPoints(DAILY_POINTS);

    if (newDaysVisited === TOTAL_DAYS) {
      markTaskAsCompleted("task-2");
      incrementPoints(BONUS_POINTS);
      setBonusUnlocked(true);
      onCompletion(true);
    }

    const data = {
      daysVisited: newDaysVisited,
      lastClaimTime: currentTime.toString(),
      claimed: true,
      bonusUnlocked: newDaysVisited === TOTAL_DAYS,
    };

    saveData(data);

    setRemainingTime(COOLDOWN_HOURS * 60 * 60 * 1000);
  };

  const resetBonus = () => {
    setBonusUnlocked(false);
    saveData({ bonusUnlocked: false });
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
