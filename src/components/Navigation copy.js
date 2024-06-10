import React from "react";
import { NavLink } from "react-router-dom";
import { FaFireAlt } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";
import { GiTwoCoins } from "react-icons/gi";
import { FaPeoplePulling } from "react-icons/fa6";
import { SiGoogletasks } from "react-icons/si";
import { useThemeContext } from "../context/ThemeContext";

const Navigation = () => {
  // Set Theme
  const { theme, setTheme } = useThemeContext();
  return (
    <nav
      className={`sm:w-[50%] w-[100%] fixed bottom-0 flex  space-x-4 p-2 justify-around align-middle
      border border-gray-200 rounded-lg ${
        theme === "dark" ? "bg-[#010C0C]" : "bg-[#f1f1f1]"
      } overflow-x-scroll scrollbar-hide`}
    >
      <NavLink
        to="/"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins m-2.5
${
  isActive
    ? "bg-gradient-to-r from-[#A97A0F] to-[#CFAC3F] text-gray-300"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#010C0C]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 py-3 px-6`;
        }}
      >
        <GiTwoCoins className=" text-xl" />
        <p className=" sm:text-base text-sm">Tap</p>
      </NavLink>

    

      <NavLink
        to="/ref"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins m-2.5
${
  isActive
    ? "bg-gradient-to-r from-[#A97A0F] to-[#CFAC3F] text-gray-300"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#010C0C]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 py-3 px-6`;
        }}
      >
        <FaPeoplePulling className=" text-xl" />
        <p className=" sm:text-base text-sm">Referrals</p>
      </NavLink>

      <NavLink
        to="/task"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins m-2.5
${
  isActive
    ? "bg-gradient-to-r from-[#A97A0F] to-[#CFAC3F] text-gray-300"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#010C0C]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 py-3 px-6`;
        }}
      >
        <SiGoogletasks className=" text-xl" />
        <p className=" sm:text-base text-sm">Task</p>
      </NavLink>

      <NavLink
        to="/boost"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins m-2.5
${
  isActive
    ? "bg-gradient-to-r from-[#A97A0F] to-[#CFAC3F] text-gray-300"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#010C0C]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 py-3 px-6`;
        }}
      >
        <FaFireAlt className=" text-xl" />
        <p className=" sm:text-base text-sm">Boost</p>
      </NavLink>

      <NavLink
        to="/news"
        className={({ isActive }) => {
          return `w-full text-base text-center font-poppins m-2.5
${
  isActive
    ? "bg-gradient-to-r from-[#A97A0F] to-[#CFAC3F] text-gray-300"
    : `${
        theme === "dark"
          ? "bg-[#232837] hover:text-[#D3B166] active:bg-[#D3B166]"
          : "bg-[#f1f1f1] hover:text-[#010C0C] active:bg-[#010C0C]"
      } text-gray-100  transition duration-300 ease-in active:text-gray-300`
}
    border-0 cursor-pointer rounded capitalize font-semibold flex sm:flex-row flex-col sm:gap-3 gap-0 justify-center items-center sm:py-2 sm:px-0 py-3 px-6`;
        }}
      >
        <GiNewspaper className=" text-xl" />
        <p className=" sm:text-base text-sm">News</p>
      </NavLink>
      
    </nav>
  );
};

export default Navigation;
