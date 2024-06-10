import React from "react";
import { useThemeContext } from "../context/ThemeContext";
import { useParams, useLocation, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { useNews } from "../context/NewsContext";

import { MdOutlineArrowBackIos } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import logoSvg from "../assets/logo.svg";

const NewsFeedDetails = () => {
  // Set Theme
  const { theme, setTheme } = useThemeContext();

  const { news } = useNews();

  // Get id of news feed
  //   const location = useLocation();
  //   const fromDashboard = location.state

  const { id } = useParams();
  const data = news.tasks;
  //   console.log(id);
  //   console.log(news.tasks);

  const newsDetail = data.find((newsDetail) => {
    return newsDetail.id === id;
  });

  console.log(newsDetail);

  return (
    <div
      className={`fixed top-0 w-full h-full first-letter:backdrop-blur-sm flex items-center justify-center font-poppins  ${
        theme === "dark"
          ? "bg-gray-200 bg-opacity-30 "
          : "bg-gray-100 bg-opacity-30 "
      }`}
    >
      <div
        className={`sm:w-[65%] w-[95%] h-[60%] bg-opacity-75 rounded-lg  ${
          theme === "dark"
            ? "bg-[#19191E] text-white "
            : "bg-[#FFFFFF] text-[#19191E]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {newsDetail ? (
          <div className=" flex flex-col">
            <div
              className=" justify-center  space-y-4 w-full
        sm:max-h-[750px] max-h-[500px] sm:h-[510px] overflow-x-scroll scrollbar-hide pb-16"
            >
              <img
                src={newsDetail.image}
                className=" h-60 w-full object-cover rounded-lg"
              />
              <h1 className=" py-2 px-4 font-semibold sm:text-6xl text-3xl text-left sm:tracking-wide tracking-wider">
                {newsDetail.title}
              </h1>
              <p className="  px-4 tracking-wide text-gray-100 text-justify text-lg sm:text-md">
                {newsDetail.desc}Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Recusandae vel dolores tempora id maxime
                harum! Ab ut tempora ratione id deleniti nam harum! Lorem ipsum
                dolor sit, amet consectetur adipisicing elit. Recusandae vel
                dolores tempora id maxime harum! Ab ut tempora ratione id
                deleniti nam harum! Lorem ipsum dolor sit, amet consectetur
                adipisicing elit.{" "}
              </p>
            </div>

            <div
              className="
             [text-decoration:none] text-lg text-[#E9B454] sm:w-full w-[99%] justify-between  flex items-center px-4 sm:mt-6 my-2 mb-4 z-10"
            >
              <div className=" flex flex-row  gap-2 items-center">
                <img
                  src={logoSvg}
                  alt="CryptoBucks"
                  className={` w-8 h-8 rounded-full sm:flex hidden ${
                    theme === "dark" ? " bg-[#E9B454]" : "bg-[#AC9053]"
                  }`}
                />
                <div className=" flex-col  sm:flex hidden mr-4">
                  <h1
                    className={`${
                      theme === "dark" ? "text-[#ffffff]" : "text-[#010C0C]"
                    } text-base  font-normal bg-indigo-500 `}
                  >
                    Sasha Kindred
                  </h1>
                  <h1 className=" font-light text-sm bg-indigo-500 text-gray-100">
                    Published 28th March, 2024
                  </h1>
                </div>
                <div className=" flex flex-row items-center gap-2 cursor-pointer">
                  <SlLike />
                  <h1
                    className={`${
                      theme === "dark" ? "text-[#ffffff]" : "text-[#010C0C]"
                    } text-base  font-normal bg-indigo-500 `}
                  >
                    2
                  </h1>
                </div>
              </div>

              <Link
                to={`/news`}
                className=" bg-[#19191E] px-4 py-2 rounded border border-gray-200 flex flex-row items-center cursor-pointer"
              >
                <MdOutlineArrowBackIos />
                <h1 className="text-base font-normal bg-indigo-500 text-white">
                  Back
                </h1>
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="w-full min-h-[60vh] h-full flex justify-center items-center
           "
          >
            <div
              className="w-8 h-8 border-4 border-cyan rounded-full
           border-b-gray-200 animate-spin 
           "
              role="status"
            />
            <span className="ml-2">please wait...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeedDetails;
