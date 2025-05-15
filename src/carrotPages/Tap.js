import React, { useState,useContext, useEffect, memo } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import { FaTrophy, FaChevronRight } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import crypto from "../assets/crypto.png";
import logo3 from "../assets/logo3.png";
import treasure from "../assets/treasure.png"; // Import the treasure icon
import Logo from "../components/Logo.js";
import { useTapContext } from "../context/TapContext.js";
import { useTelegramUser } from "../context/TelegramContext.js";
import { ClaimContext } from "../context/ClaimContext.js";
import { Link } from "react-router-dom";
import DailyCheckIn from "./DailyCheckIn.js";
import RobotIcon from "../components/RobotIcon.js";
import "../components/robotIcon.css";
import { useTreasureContext } from '../context/treasureContext.js'; // Import the custom hook
import useForceUpdate from '../components/useForceUpdate.js'; // Custom hook to force updates
import Campaigns from "../components/Campaigns.js";
import TokenSecurityDetection from "../components/TokenSecurityDetection.js";
import WalletButton from "../components/WalletButton.js";
import TonTrend from "../components/TonTrend.js";
import { handleDailyCheckIn } from "../components/Campaigns.js";
import { motion } from "framer-motion";

import notification from "../assets/notification.gif"; // Replace 'myGif.gif' with the actual name of your GIF file

import "./Tap.css";



const Tap = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser();
  const [refreshState, setRefreshState] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false); // State for visibility of notification gif and Top 60 text
  // Function to force a re-render
  const handleCheckIn = () => {
    setRefreshState(prev => !prev);
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setNotificationVisible((prevVisible) => !prevVisible);
    };

    // Initial delay to make it visible after 30 seconds
    const initialTimeout = setTimeout(() => {
      setNotificationVisible(true);

      // After 30 seconds, start the cycle of 30 seconds visible and 1 minute invisible
      const cycleInterval = setInterval(toggleVisibility, 90 * 1000); // 1 minute 30 seconds

      // Clean up interval when component unmounts
      return () => clearInterval(cycleInterval);
    }, 30 * 1000); // 30 seconds

    // Clean up timeout when component unmounts
    return () => clearTimeout(initialTimeout);
  }, []);

  // useEffect to listen for specific localStorage key changes
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dailyOpenCount" || event.key === "consecutiveOpenCount") {
        setRefreshState(prev => !prev);  // Trigger re-render only when the specific keys change
      }
    };

    // Listen for the 'storage' event
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Whenever refreshState changes, Tap.js will re-fetch or re-render values
    console.log("Tap.js is re-rendering due to state change.");
  }, [refreshState]);

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
  // Access values from ClaimContext
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
    markTaskAsCompleted,
    onCompletion, 
  } = useContext(ClaimContext);
  const forceUpdate = useForceUpdate(); // Custom hook to force updates

  const [animate, setAnimate] = useState(false);
  const [isTappable, setIsTappable] = useState(true);
  const [coinAnimations, setCoinAnimations] = useState([]);
  const [showGiftIcon, setShowGiftIcon] = useState(true);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);

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

    if (daysVisited + 1 === TOTAL_DAYS) {
      toast.success(`Congratulations! You've unlocked an additional ${BONUS_POINTS} bonus points!`, {
        position: "top-center",
      });
    }
    handleDailyCheckIn();
    console.log("Checkin Recorded")
  };  

  const formatCountdown = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };


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
    if (count >= 10000000) return "NeuronAce";
    if (count >= 5000000) return "AlgoLorX ";
    if (count >= 2000000) return "QuantumX";
    if (count >= 1200000) return "TensorTX";
    if (count >= 500000) return "LogicLoX";
    if (count >= 100000) return "PixelPX";
    if (count >= 20000) return "DataDuX";
    if (count >= 5000) return "MstX ";
    if (count >= 1000) return "CodeQX";
    if (count >= 200) return "QuantX";
    if (count >= 100) return "ByteX";
    return "SynthX";
  };

  const handleRewardClaim = (rewardAmount) => {
    incrementPoints(rewardAmount);
  };

  const formatCount = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className={`h-full w-[90%] min-h-screen flex flex-col mt-20 mb-4 relative font-inter bg-black `}>
      <div className="gradient-06 z-0 w-full h-full w-30 font-inter" />
      <div
        className={`z-10 w-full sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide bg-black ${
          theme === "dark" ? "text-[#fff]" : "text-[#19191E]"
        }`}
      >


        <div className="relative  w-full">
          <div className="fixed top-0 -mt-1 right-2 flex flex-row justify-between items-center w-full px-2 lg:px-8">
            {/* Logo */}
            <div className="flex items-center mr-2 sm:mr-1 lg:mr-4 ml-4 sm:ml-2 lg:ml-8 mt-2 sm:mt-1 lg:mt-3">
              <Logo className="w-6 h-6" />
            </div>



            {/* Campaigns */}
            <div className="mr-0.5 sm:mr-0.25 lg:mr-1 mt-1 sm:mt-0.5 lg:mt-2">
              <Campaigns refreshState={refreshState} />
            </div>

            {/* Logo3 and Count */}
            <div className="flex items-center mr-4 sm:mr-2 lg:mr-4">
              <img src={logo3} className="w-6 sm:w-5 lg:w-7 object-cover mr-1 sm:mr-1 lg:mr-1 mt-1 sm:mt-0.5 lg:mt-2" alt="Logo" />
              <div className={`${theme === "dark" ? "text-white" : "text-[#19191E]"} text-sm sm:text-base mr-2 lg:text-lg xl:text-xl 2xl:text-2xl font-semibold whitespace-nowrap`} style={{ fontSize: count > 100 ? '12px' : '14px' }}>
                {formatCount(count)}
              </div>

            </div>
            {/* Wallet Button */}
            <div className="ml-auto">
              <WalletButton />
            </div>
            
          </div>
        </div>


        {coinAnimations.slice(0, 4).map((coin, index) => (
            <div
              key={coin.id}
              className="coin-animation"
              style={{
                position: 'absolute',
                transform: `translate(${Math.random() * 25 - 8}px, ${Math.random() * 25 - 8}px)`,
                animationDelay: `${index * 0.1}s`,
                color: 'gold',
                fontSize: '0.6rem',
                marginLeft: '8.7rem',
                marginTop: '-18rem',
              }}
            >
              +{coin.value}
            </div>
          ))}
      
        <TonTrend />

        {/*<header >
          <TonConnectButton className="my-button-class" style={{ float: "right",}}/>
        </header>

        <header>
          <button onClick={() => tonConnectUI.openModal()} style={{ float: "right",}}>
            Connect Wallet
          </button>
        </header> */}  

        <TokenSecurityDetection />
        <div className="flex flex-col items-center sm:p-0 p-3">
        
          
          
          <div className="flex flex-col h-full sm:w-[80%] w-full items-center py-6 justify-items-center sm:space-y-20 space-y-16">
            
            
            {/*<div className="small-robot-icon-container" style={{ marginTop: '-2%' }}>
              <RobotIcon className="small-robot-icon" />
              <div className="red-dot"></div>
            </div> */}

            <div className="flex items-center justify-center mt-1" style={{ marginTop: '0.1rem', marginLeft: '49%', position: 'absolute' }}>
              <Link to="/leaderboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <span className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl" style={{ color: "#96DED1", marginRight: '0.5rem', lineHeight: '1.2' }}>
                  {getRankText()}
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '0.6rem', }}>
                  <FaTrophy style={{ color: 'gold', marginRight: '2px', fontSize: '12px', verticalAlign: 'middle' }} />
                  {/* Notification gif and Top 60 text visibility toggled here */}
                  {/*{notificationVisible && (
                    <>
                      <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)' }}>
                        <img 
                          src={notification} 
                          alt="GIF that notifies users" 
                          className="notification-gif-class" 
                          style={{ width: '25px', height: '25px', display: 'block' }} 
                        />
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl" style={{ verticalAlign: 'middle' }}>Top 60</span>
                    </>
                  )} */}
                  <FaChevronRight style={{ marginLeft: '1px', fontSize: '10px', verticalAlign: 'middle' }} />
                </div>
              </Link>
            </div>

            
            {/* Treasure and Points */}
            <div className="flex items-center mr-2 sm:mr-1 lg:mr-4 mt-2 sm:mt-1 lg:mt-3 ml-0.5 sm:ml-0.25 lg:ml-1"style={{ marginTop: '3rem', marginLeft: '-80%', position: 'absolute' }}>
              <img src={treasure} className="w-4 h-4 mr-1 sm:mr-0.5 lg:mr-1.5" alt="Treasure" />
              <span className={`${theme === "dark" ? "text-white" : "text-[#19191E]"} font-semibold text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl whitespace-nowrap`}>
                {treasurePoints}
              </span>
            </div>            

            {/*<div
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
              <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-100">Tap coin, Earn $NEXAI</p>
              <br></br>
            </div> */}

            <div
              className="w-full flex flex-col items-center mb-16"
              style={{ marginTop: "-1%" }}
            > {/*<p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-100">Tap coin, Earn $NEXT</p>*/}
              <br></br>
              <div className="flex flex-col items-center justify-center w-[80%] mb-4">
                <div className="w-full bg-[#D2B48C] rounded-full h-4 overflow-hidden mb-2">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-[#5A5FFF] to-[#6B7CFE]"
                    style={{
                      width: `${(1-((remainingTime / 1000) / (12 * 3600))) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex items-center text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-100 ">
                  {remainingTime > 0 && (
                    <div>
                      <span className="text-l mx-1"></span> Next Epoch in{" "}
                      <span className="ml-2 font-bold text-white">
                        {formatCountdown(remainingTime)}
                      </span>
                    </div>
                  )}

                  {canClaim ? (
                    <button
                      onClick={handleClaimClick}
                      className="px-4 py-1 rounded-md font-semibold bg-[#4A4FFF] text-white text-xs sm:text-sm"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-gray ml-2">
                      Claimed
                    </span>
                  )}
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
