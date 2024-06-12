import React, { useContext } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import { TrendingContext } from "../context/TrendingContext.js";
import { tasks } from "../data/index.js";
import { Link, useNavigate } from "react-router-dom";
import { SlLike } from "react-icons/sl";

const NewsFeed = () => {
  // Set Theme shadow-md shadow-gray-900/5
  const { theme, setTheme } = useThemeContext();
  const { trendData } = useContext(TrendingContext);

  // variable to limit the number of trending coins
  const limit = 3;

  const storeTrend = trendData;

  console.log(storeTrend);

  return (
    <section
      className={`h-full w-full items-center flex flex-col mt-20 mb-24  relative ${
        theme === "dark"
          ? "bg-[#19191E] text-[#fff]"
          : "bg-[#F1F2F2] text-[#19191E]"
      } `}
    >
      <h1 className=" sm:text-5xl text-3xl mt-4 text-center font-semibold">
        {" "}
        News & Media
      </h1>

      <div className=" font-poppins mt-2">Trending Coins</div>
      <div
        className={`pt-2 pb-4  sm:w-full w-[100%] space-x-2  pl-16 -pr-16
        h-40 overflow-y-scroll scrollbar-hide flex items-center justify-around mt-2   mx-6 rounded-md ${
          theme === "dark" ? "bg-[#19191E]" : "bg-[#FCFCFC]"
        }`}
      >
        {/* To display only the limited trending coin */}
        {/* {trendData?.slice(0, limit).map((data, index) => { */}

        {/* To display all the trending coin */}
        {trendData?.map((data, index) => {
          return (
            <div
              className={`${
                theme === "dark"
                  ? " bg-gradient-to-b from-[#19191E] to-[#010C0C] border border-gray-200"
                  : "bg-gradient-to-t from-[#FFFFFF] to-[#F1F2F2] border border-[#F1F2F2]"
              } justify-center w-32 h-32 flex flex-col p-3 mt-6 rounded-md `}
            >
              <img
                src={data.item.thumb}
                alt={data.name}
                className=" w-8 h-8 rounded-full"
              />
              {data.item.name}
              <h3 className=" flex flex-col items-left my-0.5 text-sm ">
                <span className="text-gray-100 uppercase w-28">
                  price (in usd):&nbsp;
                </span>
                <span className="text-[#D3B166]">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "usd",
                    maximumSignificantDigits: 3,
                  }).format(data.item.data.price)}
                </span>
              </h3>
            </div>
          );
        })}
      </div>

      <div className=" w-full min-h-[60vh] py-8   mx-auto  grid max-w-2xl grid-cols-1 items-start  lg:max-w-none lg:grid-cols-3 ">
        {tasks.map((task, index) => (
          // console.log(index),
          <Link
            to={{
              pathname: `/news/${index}`,
              state: `one`,
            }}
            key={index}
            className={`relative flex flex-row overflow-hidden rounded-md p-3 mr-2 mb-2  shadow-md shadow-gray-900/5 ${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#ffffff] "
            }     cursor-pointer`}
          >
            <div className=" flex flex-1">
              <img src={task.image} className=" object-cover rounded-md" />
            </div>
            <div className=" flex flex-[0.3] flex-col w-full">
              <h1 className=" px-3 font-poppins sm:text-[1.3rem]  text-xl font-semibold w-64">
                {task.title}
              </h1>
              <h1 className=" px-3 font-poppins sm:text-base  text-sm font-normal text-gray-100">
                {task.desc}
              </h1>
            </div>

            {/* <div
              className={`absolute top-[1rem] glassmorphism  right-[1.2rem] sm:text-base tracking-wide text-sm bg-[#15231D] text-[#D3B166] p-2 rounded-md border border-gray-100`}
            >
              <div className=" flex flex-row items-center gap-2">
                <SlLike />
                <h1
                  className={`${
                    theme === "dark" ? "text-[#D3B166]" : "text-[#010C0C]"
                  } text-base  font-normal bg-indigo-500 `}
                >
                  2
                </h1>
              </div>
            </div> */}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewsFeed;
