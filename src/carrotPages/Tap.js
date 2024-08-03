import React, { useState, useEffect, memo } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import { TbMilitaryRank } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import crypto from "../assets/crypto.png";
import logo3 from "../assets/logo3.png";
import treasure from "../assets/treasure.png"; // Import the treasure icon
import { useTapContext } from "../context/TapContext.js";
import { useTelegramUser } from "../context/TelegramContext.js";
import { Link } from "react-router-dom";
import DailyCheckIn from "./DailyCheckIn.js";
import RobotIcon from "../components/RobotIcon.js";
import "../components/robotIcon.css";
import { useTreasureContext } from '../context/treasureContext.js'; // Import the custom hook
import useForceUpdate from '../components/useForceUpdate.js'; // Custom hook to force updates

const GiftIcon = ({ onClick }) => {
  const [visible, setVisible] = useState(true);
  const [shake, setShake] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());

  useEffect(() => {
    let hideTimeout, showTimeout, shakeInterval, disappearTimeout;

    const hideGift = () => {
      setVisible(false);
      showTimeout = setTimeout(() => setVisible(true), 10 * 60 * 1000);
    };

    const startHideGiftTimer = () => {
      hideTimeout = setTimeout(hideGift, 5 * 60 * 1000);
    };

    if (visible) {
      startHideGiftTimer();
    } else {
      showTimeout = setTimeout(() => {
        setVisible(true);
        startHideGiftTimer();
      }, 10 * 60 * 1000);
    }

    shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
    }, 10 * 1000);

    disappearTimeout = setInterval(() => {
      if (Date.now() - lastClickTime >= 5 * 60 * 1000) {
        hideGift();
      }
    }, 1000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
      clearInterval(shakeInterval);
      clearInterval(disappearTimeout);
    };
  }, [visible, lastClickTime]);

  const handleGiftClick = () => {
    setLastClickTime(Date.now());
    onClick();
  };

  return (
    visible && (
      <div className="relative">
        <div className={`circle-animation ${visible ? "blink" : ""}`}></div>
        <div
          onClick={handleGiftClick}
          className={`fixed top-1/4 right-11 cursor-pointer z-20 ${shake ? "animate-shake" : ""}`}
          style={{ transform: "scale(2.5)" }}
        >
          🎁
        </div>
      </div>
    )
  );
};

const Tap = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser();
  const {
    count,
    incrementTap,
    coinsPerTap,
    energyLimit,
    energy,
    setEnergy,
    incrementPoints,
    refillRate,
  } = useTapContext();

  const { treasurePoints } = useTreasureContext(); // Get the treasurePoints from the context
  const forceUpdate = useForceUpdate(); // Custom hook to force updates

  const [animate, setAnimate] = useState(false);
  const [isTappable, setIsTappable] = useState(true);
  const [coinAnimations, setCoinAnimations] = useState([]);
  const [showGiftIcon, setShowGiftIcon] = useState(true);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [treasureCount, setTreasureCount] = useState(0); // State for treasure count

  useEffect(() => {
    if (energy <= 0) {
      setIsTappable(false);
    } else if (energy >= coinsPerTap) {
      setIsTappable(true);
    }
  }, [energy, coinsPerTap]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const savedTime = localStorage.getItem("lastUpdateTime");
        if (savedTime) {
          const elapsedSeconds = Math.floor(
            (Date.now() - parseInt(savedTime, 10)) / 1000
          );
          const energyGain = Math.floor(elapsedSeconds / refillRate);
          setEnergy((prevEnergy) =>
            Math.min(prevEnergy + energyGain, energyLimit)
          );
          localStorage.setItem("lastUpdateTime", Date.now());
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [energyLimit, refillRate, setEnergy]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy >= energyLimit) {
          clearInterval(interval);
          return prevEnergy;
        }
        const newEnergy = prevEnergy + 1;
        localStorage.setItem('energy', JSON.stringify(newEnergy));
        localStorage.setItem('lastUpdateTime', Date.now().toString());
        console.log(`Updated energy to: ${newEnergy}`);
        return newEnergy;
      });
    }, (refillRate * 1000) / energyLimit);

    return () => clearInterval(interval);
  }, [energyLimit, refillRate, setEnergy]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showConfirm(
          "Are you sure you want to close the app?",
          (confirmed) => {
            if (confirmed) {
              window.Telegram.WebApp.close();
            }
          }
        );
      } else {
        return "Are you sure you want to close the app?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const lastClickTime = localStorage.getItem("lastGiftClickTime");
    if (lastClickTime) {
      const timeElapsed = Date.now() - parseInt(lastClickTime, 10);
      if (timeElapsed < 4 * 60 * 60 * 1000) {
        setShowGiftIcon(false);
        setTimeout(() => setShowGiftIcon(true), 4 * 60 * 60 * 1000 - timeElapsed);
      }
    }
  }, []);

  useEffect(() => {
    console.log(`Current coinsPerTap in Tap.js: ${coinsPerTap}`);
    console.log(`Current energyLimit in Tap.js: ${energyLimit}`);
  }, [coinsPerTap, energyLimit]);

  // Force update Tap.js whenever coinsPerTap or energyLimit change
  useEffect(() => {
    forceUpdate();
  }, [coinsPerTap, energyLimit]);

  const handleClick = () => {
    if (isTappable) {
      setAnimate(!animate);
      incrementTap();
      const newCoin = { id: Date.now(), value: coinsPerTap };
      setCoinAnimations((prev) => [...prev, newCoin]);
      setTimeout(() => {
        setCoinAnimations((prev) =>
          prev.filter((coin) => coin.id !== newCoin.id)
        );
      }, 1000); // Adjusted to match the animation duration
    }
  };

  const handleGiftClick = () => {
    setShowGiftIcon(false);
    setShowDailyCheckIn(true);
    localStorage.setItem("lastGiftClickTime", Date.now().toString());
    setTimeout(() => setShowGiftIcon(true), 4 * 60 * 60 * 1000);
  };

  const getRankText = () => {
    if (count >= 100000000) return "Immortal";
    if (count >= 50000000) return "GrandMaster";
    if (count >= 20000000) return "Champion";
    if (count >= 12000000) return "Conqueror";
    if (count >= 5000000) return "Titan";
    if (count >= 1000000) return "Supreme";
    if (count >= 200000) return "Guru";
    if (count >= 50000) return "Catalyst";
    if (count >= 10000) return "Trailblazer";
    if (count >= 2000) return "PathFinder";
    if (count >= 100) return "Navigator";
    return "Explorer";
  };

  const handleRewardClaim = (rewardAmount) => {
    incrementPoints(rewardAmount);
  };

  const formatCount = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className={`h-full w-[90%] flex flex-col mt-20 mb-24 relative`}>
      <div className="gradient-06 z-0 w-full h-full w-30" />
      <div
        className={`z-10 w-full min-h-[70vh] sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide ${
          theme === "dark" ? "text-[#fff]" : "text-[#19191E]"
        }`}
      >
        {showGiftIcon && <GiftIcon onClick={handleGiftClick} />}
        {showDailyCheckIn && (
          <DailyCheckIn
            onClose={() => setShowDailyCheckIn(false)}
            onClaimReward={handleRewardClaim}
          />
        )}
        <div className="relative h-full w-full">
          <div className="fixed top-2 right-8 flex flex-col gap-1 items-center">
            <div className="flex flex-row gap-0 items-center">
              <img src={logo3} className="sm:w-10 w-10 rounded-full object-cover" alt="Logo" style={{ marginRight: '0' }} />
              <div className={`${theme === "dark" ? "text-[#fff]" : "text-[#19191E]"} sm:text-3xl text-1xl font-semibold`} style={{ marginLeft: '0' }}>
                {formatCount(count)}
              </div>
            </div>

            {coinAnimations.slice(0, 3).map((coin, index) => (
              <div
                key={coin.id}
                className="coin-animation"
                style={{
                position: 'absolute',
                transform: `translate(${Math.random() * 25 - 8}px, ${Math.random() * 25 - 8}px)`,
                animationDelay: `${index * 0.1}s`,
                color: 'gold',
                fontSize: '0.8rem',
                }}
              >
                +{coin.value}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center sm:p-0 p-3">
          <div className="flex flex-col h-full sm:w-[80%] w-full items-center py-6 justify-items-center sm:space-y-20 space-y-16">
            <div className="small-robot-icon-container" style={{ marginTop: '-2%' }}>
              <RobotIcon className="small-robot-icon" />
              <div className="red-dot"></div>
            </div>
            <div className="flex flex-col items-center mt-1" style={{ marginTop: '2%' }}>
              <Link
                to={`/ai`}
                className="cursor-pointer sm:text-base text-sm flex flex-col gap-1 items-center text-gray-100 hover:gray-300"
              >
                <span style={{ color: "#96DED1", display: "flex", alignItems: "center" }}>
                  {getRankText()}
                  <img src={treasure} className="w-3 h-3 ml-2" alt="Treasure" />
                  <span className={`${theme === "dark" ? "text-[#fff]" : "text-[#19191E]"} font-semibold ml-1`} style={{ fontSize: '15px' }}>
                    {treasurePoints}
                  </span>
                </span>
              </Link>
            </div>
            <div
              onClick={handleClick}
              className={`text-sm flex flex-col items-center gap-1 ${
                isTappable ? "cursor-pointer" : "cursor-not-allowed"
              } mt-6`}
              style={{ marginTop: '2rem' }}
            >
              <img
                src={crypto}
                alt=""
                className={`sm:w-52 sm:h-52 w-48 h-48 transition-transform duration-500 ${
                  animate ? "transform scale-110" : "transform scale-100"
                }`}
                style={{ marginTop: '-2%' }}
              />
              <p className="text-sm text-gray-100">Tap coin, Earn $Squad</p>
              <br></br>
            </div>

            <div
              className="w-full flex flex-col items-center mb-16"
              style={{ marginTop: "-0.1%" }}
            >
              <div className="flex flex-col items-center justify-center w-[80%] mb-4">
                <div className="w-full bg-[#D2B48C] rounded-full h-6 overflow-hidden mb-2">
                  <div
                    className="h-6 rounded-full bg-gradient-to-r from-[#5A5FFF] to-[#6B7CFE]"
                    style={{
                      width: `${(energy / energyLimit) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex items-center text-sm text-gray-100">
                  <span className="text-2xl mx-2">🔥</span> Energy Level{" "}
                  <span className="ml-2 font-bold text-white">
                    {energy}/{energyLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Tap);
