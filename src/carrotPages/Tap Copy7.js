import React, { useState, useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { TbMilitaryRank } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import crypto from "../assets/crypto.png";
import { useTapContext } from "../context/TapContext";
import { Link } from "react-router-dom";
import DailyCheckIn from "./DailyCheckIn"; // Import the DailyCheckIn component

const GiftIcon = ({ onClick }) => {
  const [visible, setVisible] = useState(true);
  const [shake, setShake] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());

  useEffect(() => {
    let hideTimeout, showTimeout, shakeInterval, disappearTimeout;

    const hideGift = () => {
      setVisible(false);
      showTimeout = setTimeout(() => setVisible(true), 10 * 60 * 1000); // Reappear after 10 minutes
    };

    const startHideGiftTimer = () => {
      hideTimeout = setTimeout(hideGift, 5 * 60 * 1000); // Disappear after 5 minutes
    };

    if (visible) {
      startHideGiftTimer();
    } else {
      showTimeout = setTimeout(() => {
        setVisible(true);
        startHideGiftTimer();
      }, 10 * 60 * 1000); // Reappear after 10 minutes
    }

    shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 1000); // Shake duration
    }, 10 * 1000); // Shake every 10 seconds

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
          style={{ transform: "scale(2.5)" }} // Make the icon smaller
        >
          🎁
        </div>
      </div>
    )
  );
};

const Tap = () => {
  const { theme } = useThemeContext();
  const { count, incrementTap, coinsPerTap, energyLimit, energy } = useTapContext();

  const [animate, setAnimate] = useState(false);
  const [isTappable, setIsTappable] = useState(true);
  const [coinAnimations, setCoinAnimations] = useState([]);
  const [showGiftIcon, setShowGiftIcon] = useState(true);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);

  useEffect(() => {
    if (energy <= 0) {
      setIsTappable(false);
    } else if (energy >= coinsPerTap) {
      setIsTappable(true);
    }
  }, [energy, coinsPerTap]);

  const handleClick = () => {
    if (isTappable) {
      setAnimate(!animate);
      incrementTap();
      const newCoin = { id: Date.now(), value: coinsPerTap };
      setCoinAnimations((prev) => [...prev, newCoin]);
      setTimeout(() => {
        setCoinAnimations((prev) => prev.filter((coin) => coin.id !== newCoin.id));
      }, 1000);
    }
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

  const handleGiftClick = () => {
    setShowGiftIcon(false);
    setShowDailyCheckIn(true);
    setTimeout(() => setShowGiftIcon(true), 24 * 60 * 60 * 1000);
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
        {showDailyCheckIn && <DailyCheckIn onClose={() => setShowDailyCheckIn(false)} />}
        <div className="flex flex-col items-center sm:p-0 p-3">
          <div className="flex flex-col h-full sm:w-[80%] w-full items-center py-6 justify-items-center sm:space-y-20 space-y-16">
            <div className="flex flex-col gap-1 items-center relative">
              <div className="flex flex-row gap-1 items-center">
                <img src={crypto} className="sm:w-14 w-9" />
                <div
                  className={`${
                    theme === "dark" ? "text-[#fff]" : "text-[#19191E]"
                  } sm:text-6xl text-3xl font-semibold`}
                >
                  {count}
                </div>
              </div>

              <Link
                to={`/boost`}
                className="cursor-pointer sm:text-base text-sm flex flex-row gap-1 items-center text-gray-100 hover:gray-300"
              >
                <span className="text-xl">
                  <TbMilitaryRank />
                </span>
                <span>{getRankText()}</span>
                <IoIosArrowForward />
              </Link>
              
              {coinAnimations.map((coin) => (
                <div key={coin.id} className="coin-animation">
                  +{coin.value}
                </div>
              ))}
            </div>

            <div
              onClick={handleClick}
              className={`text-sm flex flex-col items-center gap-1 ${
                isTappable ? "cursor-pointer" : "cursor-not-allowed"
              } mt-10`}
            >
              <img
                src={crypto}
                alt=""
                className={`sm:w-52 sm:h-52 w-48 h-48 transition-transform duration-500 ${
                  animate ? "transform scale-110" : "transform scale-100"
                }`}
              />
              <p className="text-sm text-gray-100">Tap coin, Earn $Squad</p>
              <br></br>
            </div>

            <div className="w-full flex flex-col items-center mb-16" style={{ marginTop: '-0.02%' }}>
              <div className="flex flex-col items-center justify-center w-[80%] mb-4">
                <div className="w-full bg-[#D2B48C] rounded-full h-6 overflow-hidden mb-2">
                  <div
                    className="h-6 rounded-full bg-gradient-to-r from-[#5A5FFF] to-[#6B7CFE]"
                    style={{
                      width: `${(energy / energyLimit) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex items-center text-sm text-gray-100">
                  <span className="text-2xl mx-2">🔥</span> Energy Level <span className="ml-2 font-bold text-white">{energy}/{energyLimit}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Tap;
