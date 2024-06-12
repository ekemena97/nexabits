import React from "react";
import { NavLink } from "react-router-dom";
import { FaFireAlt } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";
import { GiTwoCoins } from "react-icons/gi";
import { FaPeoplePulling } from "react-icons/fa6";
import { SiGoogletasks } from "react-icons/si";
import { useThemeContext } from "../context/ThemeContext.js";
import crypto from "../assets/coin.png";
import coin from "../assets/coin.png";
import referral from "../assets/referral.png";
import boost from "../assets/boost.png";
import earn from "../assets/earn.png";
import news from "../assets/news.png";

const Navigation = () => {
  // Set Theme
  const { theme, setTheme } = useThemeContext();
  return (
    <nav
      className={`sm:w-[50%] w-[100%] fixed bottom-4 flex flex-row justify-around align-middle
      border border-gray-200 rounded-lg ${
        theme === "dark" ? "bg-[#010C0C]" : "bg-[#f1f1f1]"
      } `}
    >
      <NavLink
        to="/ref"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins 
${
  isActive
    ? " border-2 border-[#A97A0F] bg-[#463241]"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#232323]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 p-2`;
        }}
      >
        <img src={referral} className=" sm:w-12 w-8" />
        <p className=" sm:text-base text-sm">Friends</p>
      </NavLink>

      <NavLink
        to="/task"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins 
${
  isActive
    ? " border-2 border-[#A97A0F] bg-[#463241]"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#232323]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 p-2`;
        }}
      >
        <img src={earn} className=" sm:w-12 w-8" />
        <p className=" sm:text-base text-sm">Earn</p>
      </NavLink>

      {/* Tap */}
      <NavLink
        to="/"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins 
${
  isActive
    ? " border-2 border-[#A97A0F] bg-[#463241]"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#232323]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 p-2`;
        }}
      >
        <img src={crypto} className=" sm:w-12 w-8" />
        <p className=" sm:text-base text-sm">Tap</p>
      </NavLink>

      <NavLink
        to="/boost"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins 
${
  isActive
    ? " border-2 border-[#A97A0F] bg-[#463241]"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#232323]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 p-2`;
        }}
      >
        <img src={boost} className=" sm:w-12 w-8" />
        <p className=" sm:text-base text-sm">Boost</p>
      </NavLink>

      <NavLink
        to="/news"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins 
${
  isActive
    ? " border-2 border-[#A97A0F] bg-[#463241]"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#232323]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
    border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 p-2`;
        }}
      >
        <img src={news} className=" sm:w-12 w-8" />
        <p className=" sm:text-base text-sm">News</p>
      </NavLink>
    </nav>
  );
};

export default Navigation;
