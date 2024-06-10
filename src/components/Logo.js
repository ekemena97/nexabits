import React from "react";
import { Link } from "react-router-dom";
import logoSvg from "../assets/logo.svg";
import { CiLight } from "react-icons/ci";
import { MdOutlineNightlightRound } from "react-icons/md";

import { useThemeContext } from "../context/ThemeContext";

const Logo = () => {
  const { theme, setTheme } = useThemeContext();

  const toggleTheme = (e) => {
    e.preventDefault();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Link
      to="/"
      className="
     absolute sm:top-[1.5rem] top-[0.5rem]  left-[1.5rem] [text-decoration:none] text-lg text-[#E9B454] sm:w-[95%] w-[85%] justify-between  flex items-center mb-4 z-10"
    >
      <div className=" flex flex-row gap-2 items-center">
        <img src={logoSvg} alt="CryptoBucks" className={`  ${theme === "dark"?" bg-[#E9B454]" : "bg-[#AC9053]"}`} />
        <span className={` uppercase font-bold  ${theme === "dark"?" text-[#E9B454]" : "text-[#010C0C]"}`} >CarrotSwap</span>
      </div>

      <div onClick={(e) => toggleTheme(e)} className=" bg-[#1B2B2A] p-2 rounded border border-gray-200">
        {
          theme === "dark" ? <CiLight onClick={(e) => toggleTheme(e)} className="  transition duration-300 ease-in text-2xl font-semibold " />  : <MdOutlineNightlightRound onClick={(e) => toggleTheme(e)} className=" transition duration-300 ease-in  text-2xl font-semibold bg-indigo-500 text-white" />
        }
      </div>
    </Link>



  );
};

export default Logo;
