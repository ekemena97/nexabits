import React from "react";
import { FaBtc } from "react-icons/fa"; // Binance icon
import { BiArrowFromRight } from "react-icons/bi"; // MetaMask (Fox) icon
import { FiMenu, FiUser } from "react-icons/fi"; // Menu and User icons
import { FaDollarSign } from "react-icons/fa"; // Tether icon
import logo from '../assets/logo.png';

const LaunchPad = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-[#121212] text-white font-sans">

      {/* Header Section */}
      <div className="flex justify-between items-center w-full max-w-md py-2">
        
        {/* Logo */}
        <div className="flex-1">
          <img
            src={logo} // Placeholder for logo
            alt="Logo"
            className="w-10"
          />
        </div>
        
        {/* Wallet Info */}
        <div className="flex items-center gap-2">
          <FaBtc className="text-yellow-500 text-xl" />
          <BiArrowFromRight className="text-yellow-500 text-xl" />
          <span className="bg-gray-600 text-white px-2 py-1 rounded-lg text-sm">
            0x5...0dC
          </span>
          <FiUser className="text-xl" />
          <FiMenu className="text-xl" />
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center mt-4 max-w-md">
        <h1 className="text-2xl font-bold mb-2">AGENTS AI (Public)</h1>
        <p className="text-gray-400 text-base leading-relaxed">
          AgentsAI is a cutting-edge platform that merges AI technology with blockchain, allowing users to create, launch, and trade autonomous AI agents with ease.
        </p>
      </div>

      {/* IDO Progress Section */}
      <div className="mt-8 w-full max-w-md p-4 bg-[#1a1a1a] rounded-lg shadow-lg">
        
        {/* Total Raised */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-400 text-sm">TOTAL RAISED</div>
          <div className="flex items-center text-white text-2xl font-bold">
            <FaDollarSign className="text-green-500 mr-1" />
            139,819.72 USDT
          </div>
        </div>

        {/* Small Amount Display */}
        <div className="bg-gray-700 text-center text-white py-1 rounded mb-4">
          0.001 USDT
        </div>

        {/* Progress Bar and Text */}
        <div className="text-center text-white text-sm mb-2">
          139,819.72 / 250,000 USDT
          <br />
          Progress 55.92%
        </div>
        <div className="relative bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="absolute top-0 left-0 h-3 rounded-full"
            style={{ width: '55.92%', backgroundColor: '#6b46c1' }} // Purple background color for progress
          ></div>
        </div>

        {/* Allocation Info */}
        <div className="flex justify-between text-gray-400 text-sm mb-4">
          <div>
            <p>LIMITED</p>
            <p>Total Allocation: 0</p>
            <p>Remaining Allocation: 0</p>
          </div>
          <div>
            <p>PARTICIPANTS: 1287</p>
          </div>
        </div>

        {/* Approve Button */}
        <button
          className="w-full text-white font-semibold py-2 rounded-lg mb-4"
          style={{ backgroundColor: "#6b46c1" }} // Purple background color for button
        >
          Approve
        </button>

        {/* Countdown Timer */}
        <div className="text-center text-gray-400 text-sm">IDO ENDS IN</div>
        <div className="flex justify-center gap-2 mt-2 text-white text-lg font-semibold">
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-2 rounded-md">0</div>
            <div className="text-xs mt-1">Day</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-2 rounded-md">15</div>
            <div className="text-xs mt-1">Hours</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-2 rounded-md">31</div>
            <div className="text-xs mt-1">Mins</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-2 rounded-md">41</div>
            <div className="text-xs mt-1">Secs</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LaunchPad;
