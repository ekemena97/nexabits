import React, { useContext } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { FaTasks, FaRegGem } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClaimContext } from "../context/ClaimContext.js";

const Task2 = ({ incrementPoints, markTaskAsCompleted, onCompletion }) => {
  const {
    daysVisited,
    canClaim,
    bonusUnlocked,
    remainingTime,
    claimPoints,
    resetBonus,
    TOTAL_DAYS,
    DAILY_POINTS,
    BONUS_POINTS,
  } = useContext(ClaimContext);

  const handleClaimClick = () => {
    if (!canClaim) {
      toast.info("You have already claimed your points for today.", {
        position: "top-center",
      });
      return;
    }

    claimPoints(incrementPoints, markTaskAsCompleted, onCompletion);
    toast.success(`You've earned ${DAILY_POINTS} $NEXT tokens today!`, {
      position: "top-center",
    });

    // If it's the 10th day, update the bonus to 300 and claim it
    if (daysVisited + 1 === TOTAL_DAYS) {
      const updatedBonus = 300;  // Set the bonus to 300 on the 10th day
      incrementPoints(updatedBonus);  // Increment points with the bonus
      toast.success(`Congratulations! You've claimed your ${updatedBonus} $NEXA bonus!`, {
        position: "top-center",
      });
      resetBonus();  // Reset the bonus after claiming
    } else if (daysVisited + 1 === TOTAL_DAYS - 1) {
      // If it's the 9th day, show a reminder that the bonus will be available on the next day
      toast.info("Get ready to claim your 300 $NEXA bonus tomorrow!", {
        position: "top-center",
      });
    }
  };

  const formatCountdown = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col gap-2 items-center mt-4 pb-2 font-inter">
      <h2 className="text-center text-white">
        <span className="text-sm font-semibold">Task 2: </span>
        <span className="text-xs">Visit the NexaBit App for 10 Consecutive Days</span>
      </h2>

      <div className="text-white text-xs mb-4 text-center">
        Claim 10 points daily and unlock a 300-point bonus on the 10th day!
      </div>

      <div className="px-4 py-2 rounded-md flex flex-row items-center justify-between border border-purple w-full sm:w-[60%] relative">
        <div className="flex flex-row items-center gap-2">
          <span className="text-2xl">
            {canClaim ? (
              <FaTasks className="text-blue rounded-md mr-1" />
            ) : (
              <IoIosCheckmark className="text-purple rounded-md" />
            )}
          </span>
          <p className="sm:text-base text-sm">Day {daysVisited} / {TOTAL_DAYS}</p>
        </div>

        <button
          onClick={handleClaimClick}
          className={`px-4 py-1 rounded-md font-semibold ${!canClaim ? "bg-purple" : "bg-[#4A4FFF] text-white"} text-xs sm:text-sm`}
          disabled={!canClaim}
        >
          {canClaim ? (daysVisited + 1 === TOTAL_DAYS ? "Claim +300 $NEXA" : "Claim +10 $NEXT") : "Claimed"}
        </button>

        {remainingTime > 0 && (
          <div className="absolute top-full right-0 mt-1 text-xs">
            <span className="text-gray-400">Next Claim in</span>{" "}
            <span className="text-white">
              {formatCountdown(remainingTime)}
            </span>
          </div>
        )}
      </div>

      {/* Show teaser for bonus every day */}
      <div className="flex flex-col items-start w-full sm:w-[60%] mt-2">
        <div className="flex items-center gap-1 px-1 py-0 rounded-lg text-yellow-400 -mt-1">
          <FaRegGem className="text-[#6a0dad] text-xs" />
          <span className="text-xs font-semibold text-gold">+300</span>
          <span className="text-xs text-white">$NEXT Voucher</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Task2;
