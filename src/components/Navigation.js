import React from "react";
import { NavLink } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext.js";
import crypto from "../assets/coin.png";
import referral from "../assets/referral.png";
import boost from "../assets/boost.png";
import earn from "../assets/earn.png";
import news from "../assets/news.png";

const Navigation = () => {
  const { theme } = useThemeContext();

  return (
    <nav
      className={`fixed bottom-0 z-50 flex justify-around items-center`}
      style={{
        height: "90px", // Adjust the height to ensure it overlaps content below
        backgroundColor: theme === "dark" ? "rgba(34, 40, 54, 255)" : "rgba(241, 241, 241, 0.6)", // Add transparency
        borderRadius: "15px", // Add rounded corners
        margin: "0 10px 10px 10px", // Add margin to move away from left and right
        left: "5px", // Ensure the nav is away from the left edge
        right: "5px", // Ensure the nav is away from the right edge
      }}
    >
      <NavLink
        to="/ref"
        className={({ isActive }) => {
          return `flex-grow flex-basis-0 text-base text-center font-poppins 
          ${
            isActive
              ? "border-t-4 border-[#A97A0F]" // Thicker gold border at the top when active
              : "text-gray-100 transition duration-300 ease-in active:text-gray-300"
          }
          cursor-pointer rounded capitalize font-semibold flex flex-col justify-center items-center h-full p-2`;
        }}
      >
        <img src={referral} className="sm:w-12 w-8" alt="Friends" style={{ transform: 'translateY(-15px)' }} /> {/* Move image upwards */}
        <p className="sm:text-base text-sm" style={{ marginTop: '-15px' }}>Friends</p> {/* Move text upwards */}
      </NavLink>

      <NavLink
        to="/task"
        className={({ isActive }) => {
          return `flex-grow flex-basis-0 text-base text-center font-poppins 
          ${
            isActive
              ? "border-t-4 border-[#A97A0F]" // Thicker gold border at the top when active
              : "text-gray-100 transition duration-300 ease-in active:text-gray-300"
          }
          cursor-pointer rounded capitalize font-semibold flex flex-col justify-center items-center h-full p-2`;
        }}
      >
        <img src={earn} className="sm:w-12 w-8" alt="Earn" style={{ transform: 'translateY(-15px)' }} /> {/* Move image upwards */}
        <p className="sm:text-base text-sm" style={{ marginTop: '-15px' }}>Earn</p> {/* Move text upwards */}
      </NavLink>

      <NavLink
        to="/"
        className={({ isActive }) => {
          return `flex-grow flex-basis-0 text-base text-center font-poppins 
          ${
            isActive
              ? "border-t-4 border-[#A97A0F]" // Thicker gold border at the top when active
              : "text-gray-100 transition duration-300 ease-in active:text-gray-300"
          }
          cursor-pointer rounded capitalize font-semibold flex flex-col justify-center items-center h-full p-2`;
        }}
      >
        <img src={crypto} className="sm:w-12 w-8" alt="Tap" style={{ transform: 'translateY(-15px)' }} /> {/* Move image upwards */}
        <p className="sm:text-base text-sm" style={{ marginTop: '-15px' }}>Tap</p> {/* Move text upwards */}
      </NavLink>

      <NavLink
        to="/boost"
        className={({ isActive }) => {
          return `flex-grow flex-basis-0 text-base text-center font-poppins 
          ${
            isActive
              ? "border-t-4 border-[#A97A0F]" // Thicker gold border at the top when active
              : "text-gray-100 transition duration-300 ease-in active:text-gray-300"
          }
          cursor-pointer rounded capitalize font-semibold flex flex-col justify-center items-center h-full p-2`;
        }}
      >
        <img src={boost} className="sm:w-12 w-8" alt="Boost" style={{ transform: 'translateY(-15px)' }} /> {/* Move image upwards */}
        <p className="sm:text-base text-sm" style={{ marginTop: '-15px' }}>Boost</p> {/* Move text upwards */}
      </NavLink>

      <NavLink
        to="/news"
        className={({ isActive }) => {
          return `flex-grow flex-basis-0 text-base text-center font-poppins 
          ${
            isActive
              ? "border-t-4 border-[#A97A0F]" // Thicker gold border at the top when active
              : "text-gray-100 transition duration-300 ease-in active:text-gray-300"
          }
          cursor-pointer rounded capitalize font-semibold flex flex-col justify-center items-center h-full p-2`;
        }}
      >
        <img src={news} className="sm:w-12 w-8" alt="News" style={{ transform: 'translateY(-15px)' }} /> {/* Move image upwards */}
        <p className="sm:text-base text-sm" style={{ marginTop: '-15px' }}>News</p> {/* Move text upwards */}
      </NavLink>
    </nav>
  );
};

export default Navigation;
