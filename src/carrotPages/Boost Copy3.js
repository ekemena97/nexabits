import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { useTapContext } from '../context/TapContext';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { HiHandRaised } from 'react-icons/hi2';
import { MdBatteryChargingFull, MdElectricBolt } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import crypto from '../assets/crypto.png';

const Boost = () => {
  const { theme } = useThemeContext();
  const { count, decrementCount, coinsPerTap, setCoinsPerTap } = useTapContext();

  const handleMultiTapClick = () => {
    if (count >= 100) {
      decrementCount(100);
      setCoinsPerTap(2);
    }
  };

  const isMultiTapActive = count >= 100;
  const textColor = isMultiTapActive ? 'text-white' : 'text-gray-100';

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
              {/* Energy booster 1 */}
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
                    <div className={`${textColor} text-sm`}>Multi tap</div>
                    <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                      <img src={crypto} className="sm:w-6 w-4" />
                      <div className={textColor}>5,000</div> | <div className="text-gray-100">level 1</div>
                    </div>
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-gray-100" />
              </div>

              {/* Other boosters (unchanged) */}
              <div className={`${
                  theme === 'dark'
                    ? 'bg-[#232323] border border-gray-200'
                    : 'bg-[#fff] border border-[#F1F2F2]'
                } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-200 ease-in`}
              >
                <div className="flex flex-row items-center gap-2">
                  <MdBatteryChargingFull className="text-gray-100 sm:text-4xl text-3xl" />
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-100 text-sm">Energy Limits</div>
                    <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                      <img src={crypto} className="sm:w-6 w-4" />
                      <div>200,000</div> | <div>11 level</div>
                    </div>
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-gray-100" />
              </div>

              <div className={`${
                  theme === 'dark'
                    ? 'bg-[#232323] border border-gray-200'
                    : 'bg-[#fff] border border-[#F1F2F2]'
                } flex flex-row gap-1 items-center justify-between px-6 py-3 rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-200 ease-in`}
              >
                <div className="flex flex-row items-center gap-2">
                  <MdElectricBolt className="text-gray-100 sm:text-4xl text-3xl" />
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-100 text-sm">Recharge Speed</div>
                    <div className="text-gray-100 text-sm flex flex-row gap-2 items-center">
                      <img src={crypto} className="sm:w-6 w-4" />
                      <div>200,000</div> | <div>11 level</div>
                    </div>
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-gray-100" />
              </div>

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
                      <div>200,000</div> | <div>11 level</div>
                    </div>
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-gray-100" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Boost;
