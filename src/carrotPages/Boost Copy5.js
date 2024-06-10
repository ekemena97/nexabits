import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { useTapContext } from '../context/TapContext';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { HiHandRaised } from 'react-icons/hi2';
import { MdBatteryChargingFull, MdElectricBolt } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import crypto from '../assets/crypto.png';

const levelRequirements = [
  { level: 2, cost: 1000, pointsPerTap: 2 },
  { level: 3, cost: 5000, pointsPerTap: 3 },
  { level: 4, cost: 20000, pointsPerTap: 5 },
  { level: 5, cost: 100000, pointsPerTap: 8 },
  { level: 6, cost: 300000, pointsPerTap: 12 },
  { level: 7, cost: 700000, pointsPerTap: 17 },
  { level: 8, cost: 1000000, pointsPerTap: 20 },
  { level: 9, cost: 5000000, pointsPerTap: 25 }
];

const energyLevelRequirements = [
  { level: 1, cost: 500, energyLimit: 1000, refillRate: 10 },
  { level: 2, cost: 1000, energyLimit: 2000, refillRate: 20 },
  { level: 3, cost: 5000, energyLimit: 3000, refillRate: 30 },
  { level: 4, cost: 10000, energyLimit: 4000, refillRate: 40 },
  { level: 5, cost: 20000, energyLimit: 5000, refillRate: 50 },
  { level: 6, cost: 50000, energyLimit: 6000, refillRate: 60 },
  { level: 7, cost: 100000, energyLimit: 7000, refillRate: 70 },
  { level: 8, cost: 500000, energyLimit: 8000, refillRate: 80 }
];

const rechargeLevelRequirements = [
  { level: 1, cost: 500, nextCost: 5000 },
  { level: 2, cost: 5000, nextCost: 20000 },
  { level: 3, cost: 20000, nextCost: 50000 },
  { level: 4, cost: 50000, nextCost: 100000 },
  { level: 5, cost: 100000, nextCost: null } // Level 5 is the max level
];

const Boost = () => {
  const { theme } = useThemeContext();
  const { count, decrementCount, coinsPerTap, setCoinsPerTap, energyLimit, setEnergyLimit, refillRate, setRefillRate } = useTapContext();
  const [currentLevel, setCurrentLevel] = useState(() => {
    const savedLevel = localStorage.getItem('currentLevel');
    return savedLevel ? parseInt(savedLevel) : 1;
  });
  const [nextLevelRequirement, setNextLevelRequirement] = useState(levelRequirements[0]);
  const [energyLevel, setEnergyLevel] = useState(() => {
    const savedEnergyLevel = localStorage.getItem('energyLevel');
    return savedEnergyLevel ? parseInt(savedEnergyLevel) : 1;
  });
  const [nextEnergyLevelRequirement, setNextEnergyLevelRequirement] = useState(energyLevelRequirements[0]);
  const [rechargeLevel, setRechargeLevel] = useState(() => {
    const savedRechargeLevel = localStorage.getItem('rechargeLevel');
    return savedRechargeLevel ? parseInt(savedRechargeLevel) : 1;
  });
  const [nextRechargeLevelRequirement, setNextRechargeLevelRequirement] = useState(rechargeLevelRequirements[0]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (currentLevel > 1 && currentLevel <= levelRequirements.length) {
      setNextLevelRequirement(levelRequirements[currentLevel - 1]);
    } else if (currentLevel > levelRequirements.length) {
      setNextLevelRequirement(null);
    }
    localStorage.setItem('currentLevel', currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    if (energyLevel > 1 && energyLevel <= energyLevelRequirements.length) {
      setNextEnergyLevelRequirement(energyLevelRequirements[energyLevel - 1]);
    } else if (energyLevel > energyLevelRequirements.length) {
      setNextEnergyLevelRequirement(null);
    }
    localStorage.setItem('energyLevel', energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    if (rechargeLevel >= 1 && rechargeLevel < rechargeLevelRequirements.length) {
      setNextRechargeLevelRequirement(rechargeLevelRequirements[rechargeLevel - 1]);
    } else {
      setNextRechargeLevelRequirement(null);
    }
    localStorage.setItem('rechargeLevel', rechargeLevel);
  }, [rechargeLevel]);

  const handleMultiTapClick = () => {
    if (count >= nextLevelRequirement.cost) {
      decrementCount(nextLevelRequirement.cost);
      setCoinsPerTap(nextLevelRequirement.pointsPerTap);
      setCurrentLevel(currentLevel + 1);
      showCelebration();
    }
  };

  const handleEnergyUpgradeClick = () => {
    if (count >= nextEnergyLevelRequirement.cost) {
      decrementCount(nextEnergyLevelRequirement.cost);
      setEnergyLevel(energyLevel + 1);
      setEnergyLimit(nextEnergyLevelRequirement.energyLimit);
      setRefillRate(nextEnergyLevelRequirement.refillRate);
      showCelebration();
    }
  };

  const handleRechargeUpgradeClick = () => {
    if (count >= nextRechargeLevelRequirement.cost && (rechargeLevel < rechargeLevelRequirements.length)) {
      decrementCount(nextRechargeLevelRequirement.cost);
      setRefillRate(Math.max(refillRate / 2, 2.5));
      setRechargeLevel(rechargeLevel + 1);
      showCelebration();
    }
  };

  const showCelebration = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    if (currentLevel === 9) {
      alert(`You've reached the highest level! Enter the raffle draw here: https://www.chatgpt.com/`);
    }
  };

  const isMultiTapActive = count >= nextLevelRequirement?.cost;
  const isEnergyUpgradeActive = count >= nextEnergyLevelRequirement?.cost;
  const isRechargeUpgradeActive = count >= nextRechargeLevelRequirement?.cost;
  const textColor = isMultiTapActive ? 'text-white' : 'text-gray-100';
  const energyTextColor = isEnergyUpgradeActive ? 'text-white' : 'text-gray-100';
  const rechargeTextColor = isRechargeUpgradeActive ? 'text-white' : 'text-gray-100';

  return (
    <section
      className={`h-full w-[90%] flex flex-col mt-10 mb-24 relative ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#19191E] to-[#232323] text-[#fff]'
          : 'bg-[#fff] text-[#19191E]'
      } `}
    >
      <h1 className="sm:text-2xl text-xl my-3 text-center font-semibold text-gray-100">
        Boost
      </h1>

      <div
        className={`w-full min-h-[70vh] sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide ${
          theme === 'dark'
            ? 'bg-[#19191E] text-[#fff]'
            : 'bg-[#F1F2F2] text-[#19191E]'
        }`}
      >
        <div className="flex flex-col items-center sm:p-0 p-3">
          <div className="flex flex-col gap-3 sm:w-[80%] w-full items-center pt-3 justify-items-center">
            <div className="text-sm text-gray-100 text-center">
              Your $Squad balance
            </div>
            <div className="flex flex-row gap-3 items-center">
              <img src={crypto} className="sm:w-11 w-8" />
              <div
                className={`${
                  theme === 'dark'
                    ? 'bg-[#19191E] text-[#fff]'
                    : 'bg-[#F1F2F2] text-[#19191E]'
                } sm:text-6xl text-3xl font-semibold`}
              >
                {count}
              </div>
            </div>
          </div>

          {/* Boosters */}
          <div className="flex flex-col items-center gap-2 mt-6 sm:w-[80%] w-full">
            <div className="text-center">
              <span className="text-blue-500">Increase Your </span>
              <span className="text-gold-500">Earning </span>
              <span className="text-blue-500">Speed</span>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {/* Multi Tap Booster */}
              {nextLevelRequirement && (
                <div
                  onClick={isMultiTapActive ? handleMultiTapClick : undefined}
                  className={`${
                    theme === 'dark'
                      ? 'bg-[#232323] border border-gray-200'
                      : 'bg-[#fff] border border-[#F1F2F2]'
                  } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md ${
                    isMultiTapActive ? 'cursor-pointer' : 'cursor-not-allowed'
                  } hover:bg-gray-300 transition-all duration-200 ease-in`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <HiHandRaised className="text-gray-100 sm:text-4xl text-3xl" />
                    <div className="flex flex-col gap-1">
                      <div className={`${textColor} text-sm`}>Multi Tap</div>
                      <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                        <img src={crypto} className="sm:w-6 w-4" />
                        <div className={textColor}>{nextLevelRequirement.cost.toLocaleString()}</div> | <div className="text-gray-100">Level {currentLevel}</div>
                      </div>
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight className="text-gray-100" />
                </div>
              )}

              {/* Energy Limit Upgrade */}
              {nextEnergyLevelRequirement && (
                <div
                  onClick={isEnergyUpgradeActive ? handleEnergyUpgradeClick : undefined}
                  className={`${
                    theme === 'dark'
                      ? 'bg-[#232323] border border-gray-200'
                      : 'bg-[#fff] border border-[#F1F2F2]'
                  } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md ${
                    isEnergyUpgradeActive ? 'cursor-pointer' : 'cursor-not-allowed'
                  } hover:bg-gray-300 transition-all duration-200 ease-in`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <MdBatteryChargingFull className="text-gray-100 sm:text-4xl text-3xl" />
                    <div className="flex flex-col gap-1">
                      <div className={`${energyTextColor} text-sm`}>Energy Limits</div>
                      <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                        <img src={crypto} className="sm:w-6 w-4" />
                        <div className={energyTextColor}>{nextEnergyLevelRequirement.cost.toLocaleString()}</div> | <div className="text-gray-100">Level {energyLevel}</div>
                      </div>
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight className="text-gray-100" />
                </div>
              )}

              {/* Recharge Speed Upgrade */}
              {nextRechargeLevelRequirement && (
                <div
                  onClick={isRechargeUpgradeActive ? handleRechargeUpgradeClick : undefined}
                  className={`${
                    theme === 'dark'
                      ? 'bg-[#232323] border border-gray-200'
                      : 'bg-[#fff] border border-[#F1F2F2]'
                  } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md ${
                    isRechargeUpgradeActive ? 'cursor-pointer' : 'cursor-not-allowed'
                  } hover:bg-gray-300 transition-all duration-200 ease-in`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <MdElectricBolt className="text-gray-100 sm:text-4xl text-3xl" />
                    <div className="flex flex-col gap-1">
                      <div className={`${rechargeTextColor} text-sm`}>Recharge Speed</div>
                      <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                        <img src={crypto} className="sm:w-6 w-4" />
                        <div className={rechargeTextColor}>{nextRechargeLevelRequirement.cost.toLocaleString()}</div> | <div className="text-gray-100">Level {rechargeLevel}</div>
                      </div>
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight className="text-gray-100" />
                </div>
              )}

              {/* Other boosters (unchanged) */}
              <div className={`${
                  theme === 'dark'
                    ? 'bg-[#232323] border border-gray-200'
                    : 'bg-[#fff] border border-[#F1F2F2]'
                } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-200 ease-in`}
              >
                <div className="flex flex-row items-center gap-2">
                  <FaRobot className="text-gray-100 sm:text-4xl text-3xl" />
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-100 text-sm">Tap Bot</div>
                    <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                      <img src={crypto} className="sm:w-6 w-4" />
                      <div>10,000</div> | <div>Coming Soon</div>
                    </div>
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-gray-100" />
              </div>

            </div>
          </div>
        </div>
      </div>
      {showAnimation && <div className="celebration-animation">🎉 Congratulations! 🎉</div>}
    </section>
  );
};

export default Boost;
