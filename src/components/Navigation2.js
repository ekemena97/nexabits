import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext.js";
import crypto from "../assets/coin.png";
import referral from "../assets/referral.png";
import boost from "../assets/chatbot.png";
import earn from "../assets/earn.png";
import news from "../assets/news.png";

const Navigation = () => {
  const { theme } = useThemeContext();

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${viewportHeight * 0.01}px`);
    };

    // Initial call to set the viewport height
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      className={`fixed bottom-0 z-50 flex justify-around items-center`}
      style={{
        height: "calc(var(--vh, 1vh) * 10)", // Adjust the height to ensure it overlaps content below
        backgroundColor: theme === "dark" ? "rgba(34, 40, 54, 255)" : "rgba(241, 241, 241, 0.6)", // Add transparency
        borderRadius: "15px", // Add rounded corners
        margin: "0 10px 10px 10px", // Add margin to move away from left and right
        left: "5px", // Ensure the nav is away from the left edge
        right: "5px", // Ensure the nav is away from the right edge
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: Add shadow for better visibility
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
        <img src={referral} className="sm:w-12 w-8" alt="Friends" className="mb-2" /> {/* Move image upwards */}
        <p className="sm:text-base text-sm">Friends</p>
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
        <img src={earn} className="sm:w-12 w-8" alt="Earn" className="mb-2" /> {/* Move image upwards */}
        <p className="sm:text-base text-sm">Earn</p>
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
        <img src={crypto} className="sm:w-12 w-8" alt="Tap" className="mb-2" /> {/* Move image upwards */}
        <p className="sm:text-base text-sm">Tap</p>
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
        <img src={news} className="sm:w-12 w-8" alt="News" className="mb-2" /> {/* Move image upwards */}
        <p className="sm:text-base text-sm">News</p>
      </NavLink>

      <NavLink
        to="/ai"
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
        <img src={boost} className="sm:w-12 w-8" alt="Boost" className="mb-2" /> {/* Move image upwards */}
        <p className="sm:text-base text-sm">AI</p>
      </NavLink>
    </nav>
  );
};

export default Navigation;
