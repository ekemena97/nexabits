import React, { useState, useEffect } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { FaRegGem } from "react-icons/fa"; // Coin icon for voucher
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Task2 = ({ incrementPoints, markTaskAsCompleted, onCompletion }) => {
  const DAILY_POINTS = 10;
  const BONUS_POINTS = 200;
  const COOLDOWN_HOURS = 12;
  const TOTAL_DAYS = 10;

  const [daysVisited, setDaysVisited] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0); // Time remaining in milliseconds

  useEffect(() => {
    const savedDaysVisited = parseInt(localStorage.getItem("task2_daysVisited")) || 0;
    const savedLastClaimTime = localStorage.getItem("task2_lastClaimTime");
    const savedClaimedFlag = localStorage.getItem("task2_claimed") === "true";
    const savedBonusUnlocked = localStorage.getItem("task2_bonusUnlocked") === "true";

    setDaysVisited(savedDaysVisited);
    setBonusUnlocked(savedBonusUnlocked);

    const today = new Date().toDateString();
    const currentTime = Date.now();

    if (savedClaimedFlag) {
      setCanClaim(false); // Disable claim button if already claimed
      const timeSinceClaim = currentTime - parseInt(savedLastClaimTime);
      if (timeSinceClaim < COOLDOWN_HOURS * 60 * 60 * 1000) {
        setRemainingTime(COOLDOWN_HOURS * 60 * 60 * 1000 - timeSinceClaim); // Show remaining time
      } else {
        setCanClaim(true); // Enable claim button if cooldown expired
        setRemainingTime(0); // No remaining time after cooldown
      }
    } else {
      setCanClaim(true); // Allow claiming from the start
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

  const handleClaimClick = () => {
    if (!canClaim) {
      toast.info("You have already claimed your points for today.", {
        position: "top-center",
      });
      return;
    }

    const currentTime = Date.now();
    const newDaysVisited = daysVisited >= TOTAL_DAYS ? 1 : daysVisited + 1;

    setDaysVisited(newDaysVisited);
    setLastClaimDate(new Date().toDateString());
    setCanClaim(false);

    // Save the current time as the claim time and set the claimed flag
    localStorage.setItem("task2_lastClaimTime", currentTime.toString());
    localStorage.setItem("task2_daysVisited", newDaysVisited);
    localStorage.setItem("task2_claimed", "true"); // Mark as claimed
    localStorage.setItem("task2_canClaim", "false");

    incrementPoints(DAILY_POINTS);
    toast.success(`You've earned ${DAILY_POINTS} $NEXT tokens today!`, {
      position: "top-center",
    });

    if (newDaysVisited === TOTAL_DAYS) {
      markTaskAsCompleted("task-2");
      incrementPoints(BONUS_POINTS);
      setBonusUnlocked(true);
      localStorage.setItem("task2_bonusUnlocked", "true");
      toast.success(`Congratulations! You've unlocked an additional ${BONUS_POINTS} bonus points!`, {
        position: "top-center",
      });
      onCompletion(true); // Notify parent component that TOTAL_DAYS is reached
    }

    const timeRemaining = COOLDOWN_HOURS * 60 * 60 * 1000;
    setRemainingTime(timeRemaining); // Start the cooldown timer
  };

  const formatCountdown = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col gap-2 items-center mt-1 pb-2">
      <h2 className="text-lg font-semibold text-center text-white">
        Task 2 - Visit the NexaBit App for 10 Consecutive Days
      </h2>
      <div className="text-gray-100 text-sm mb-4 text-center">
        Claim 10 points daily and unlock a 200-point bonus on the 10th day!
      </div>

      <div className="px-4 py-2 rounded-md flex flex-row items-center justify-between border border-gray-200 w-full sm:w-[60%] relative">
        <div className="flex flex-row items-center gap-2">
          <span className="text-2xl">
            {canClaim ? (
              <FaTasks className="text-gray-300 rounded-md bg-[#808080]" />
            ) : (
              <IoIosCheckmark className="text-[#43b05f] rounded-md" />
            )}
          </span>
          <p className="sm:text-base text-sm">Day {daysVisited} / {TOTAL_DAYS}</p>
        </div>

        <button
          onClick={handleClaimClick}
          className={`px-4 py-1 rounded-md font-semibold ${!canClaim ? "bg-gray-400" : "bg-[#4A4FFF] text-white"} text-xs sm:text-sm`}
          disabled={!canClaim}
        >
          {canClaim ? "Claim +10 $NEXT" : "Claimed"}
        </button>

        {remainingTime > 0 && (
          <div className="absolute top-full right-0 mt-1 text-xs">
            <span className="text-gray-400">Next Claim in</span>{" "}
            <span className="text-[#FF6347] font-semibold">
              {formatCountdown(remainingTime)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start w-full sm:w-[60%] mt-2">
        <div className="flex items-center gap-1 px-1 py-0 bg-gray-700 rounded-lg text-yellow-400 mt-[-20px]">
          <FaRegGem className="text-[#6a0dad] text-xs" />
          <span className="text-xs font-semibold" style={{ color: "#FFD700" }}>+200</span>
          <span className="text-xs font-semibold">$NEXA Voucher</span>
        </div>

        {daysVisited >= TOTAL_DAYS && bonusUnlocked && (
          <button
            onClick={() => {
              toast.success(`You've claimed your ${BONUS_POINTS} $NEXA bonus!`, { position: "top-center" });
              setBonusUnlocked(false);
              localStorage.removeItem("task2_bonusUnlocked");
            }}
            className="px-6 py-2 mt-2 text-white bg-green-500 rounded-md font-semibold shadow-md hover:bg-green-600"
          >
            Claim Bonus
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Task2;
