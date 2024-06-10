import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { TbMilitaryRank } from "react-icons/tb";
import { MdElectricBolt } from "react-icons/md";
import crypto from "../assets/crypto.png";

import { useTapContext } from "../context/TapContext";
import { useThemeContext } from "../context/ThemeContext";

// useThemeContext 

const Tap = () => {
  const { count, increment } = useTapContext();

  const [animate, setAnimate] = useState(false);
  const handleClick = () => {
    setAnimate(!animate);
    increment()
  };


  // Set Theme
  const { theme, setTheme } = useThemeContext();

  return (
    <section className={`w-[80%] h-full flex flex-col mt-36  ${theme === "dark" ? "bg-[#232323] text-[#fff]" : "bg-[#F1F2F2] text-[#192928]" } `}>
      <div className="w-full min-h-[60vh] py-8  border border-gray-100 rounded flex flex-col text-center items-center justify-items-center justify-between gap-3">
        <div className=" flex flex-col items-center">
          <h1 className=" sm:text-5xl text-3xl mb-3 uppercase font-semibold">
            {count} 
            {/* {count.toFixed(3)}  */}
          </h1>

          {/* <div className="flex bg-gradient-to-r from-[#987935] to-[#B6A071] text-[#192928] shadow-md w-28 h-28 justify-center items-center rounded-full cursor-pointer">
            Tap Coin
          </div> */}

          <div onClick={handleClick} className=" text-sm flex flex-col items-center gap-1 cursor-pointer">
            <img src={crypto} alt="" className={`w-32 h-32 transition-transform duration-500 ${
        animate ? 'transform scale-110' : 'transform scale-100'
      }`} />
            <p className=" text-sm text-gray-100">Tap coin, earn points</p>
          </div>
        </div>

        <div className=" flex flex-col items-center">
          <div className=" font-medium flex flex-row items-center gap-1"><MdElectricBolt /> <p>{count.toFixed(3)}/5000</p></div>
          <Link
            to={`/boost`}
            className=" cursor-pointer sm:text-base text-sm flex flex-row gap-2 items-center text-[#D3B166] hover:text-[#E9B454] "
          >
            <span className=" text-xl">
              <TbMilitaryRank />
            </span>
            Rank: <span>Platinum </span>
            <IoIosArrowForward />
          </Link>
        </div>
      </div>

      {/* <p>Hello</p> */}
    </section>
  );
};

export default Tap;
