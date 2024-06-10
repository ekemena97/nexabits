import React, { useState } from "react";
import { realTasks } from "../data";
import { useThemeContext } from "../context/ThemeContext";
import { TbMilitaryRank } from "react-icons/tb";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosCheckmark } from "react-icons/io";
import logoSvg from "../assets/logo.svg";
import { FaTasks } from 'react-icons/fa';
import { useTapContext } from '../context/TapContext';

const Task = () => {
  const { count, incrementPoints } = useTapContext();
  const { theme } = useThemeContext();
  const [completedTasks, setCompletedTasks] = useState({});

  const handleTaskClick = (item, index) => {
    const timer = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
    setTimeout(() => {
      setCompletedTasks((prev) => ({ ...prev, [index]: true }));
      incrementPoints(parseInt(item.task_points));
    }, timer * 1000);
  };

  return (
    <section
      className={`h-full w-[90%] flex flex-col mt-20 mb-24  relative ${
        theme === "dark"
          ? "bg-[#19191E] text-[#fff]"
          : "bg-[#fff] text-[#192928]"
      } `}
    >
      <h1 className="sm:text-2xl text-xl my-3 text-center font-semibold text-gray-100">
        {/* Tasks */}
      </h1>

      <div
        className={`w-full min-h-[70vh] rounded overflow-y-scroll scrollbar-hide ${
          theme === "dark"
            ? "bg-[#19191E] text-[#fff]"
            : "bg-[#F1F2F2] text-[#192928]"
        }`}
      >
        {realTasks.map((task, taskIndex) => (
          <div key={taskIndex} className="flex mx-auto flex-col gap-3 items-center pt-5">
            <div className="flex flex-row justify-between sm:w-[80%]">
              <div className="flex sm:flex-row flex-col gap-3 sm:items-center items-start">
                <div className="flex w-full flex-col gap-2 sm:px-0 px-4">
                  <h1 className="sm:text-xl text-lg text-center sm:tracking-wide tracking-wider -mt-6 p-2">
                    {task.title}
                  </h1>
                  <div
                    className={`px-4 py-2 rounded-md flex flex-row items-center justify-between cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#232323] border border-gray-200"
                        : "bg-[#fff] border border-[#F1F2F2]"
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-3xl">
                        <TbMilitaryRank />
                      </span>
                      <p>Your Balance</p>
                    </div>
                    <div className="text-[#43B05F] text-xl font-semibold flex flex-row items-center gap-2">
                      <p className="text-2xl">{count}</p>
                      <GiTwoCoins style={{ color: 'gold' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:flex hidden justify-center flex-row mx-4">
                <img src={logoSvg} alt="CryptoBucks" className={`w-24 ${theme === "dark" ? "bg-[#E9B454]" : "bg-[#AC9053]"}`} />
              </div>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2 px-4 my-6 sm:w-[80%]">
              <h1 className="sm:text-2xl text-xl text-center" style={{ color: '#5c56e2' }}>
                Meet Binance GreenField
              </h1>
              {task?.task?.map((item, index) => (
                <a
                  href={item.task_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="no-underline"
                  onClick={() => handleTaskClick(item, taskIndex + '-' + index)}
                >
                  <div
                    className={`px-6 py-3 rounded-md flex flex-row items-center justify-between cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#232323] border border-gray-200"
                        : "bg-[#fff] border border-[#F1F2F2]"
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-3xl">
                        {completedTasks[taskIndex + '-' + index] ? (
                          <IoIosCheckmark className="text-[#ffffff] rounded-md bg-[#43b05f]" />
                        ) : (
                          <FaTasks className="text-gray-300 rounded-md bg-[#808080]" />
                        )}
                      </span>
                      <p className="sm:text-base text-sm">{item.task_title}</p>
                    </div>
                    <div className="text-gray-100 text-xl font-semibold flex flex-row items-center gap-2">
                      <p className="sm:text-base text-sm">{item.task_points}</p>
                      <GiTwoCoins style={{ color: '#eedb65' }} />
                    </div>
                  </div>
                </a>
              ))}

              <div className="flex flex-col mt-6 gap-2">
                <h1 className="sm:text-2xl text-xl font-semibold w-[70%]">
                  Use your tron wallet to earn points 🌕
                </h1>
                {task?.task?.map((item, index) => (
                  <a
                    href={item.task_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                    className="no-underline"
                    onClick={() => handleTaskClick(item, taskIndex + '-' + index)}
                  >
                    <div
                      className={`px-6 py-3 rounded-md flex flex-row items-center justify-between cursor-pointer ${
                        theme === "dark"
                          ? "bg-[#232323] border border-gray-200"
                          : "bg-[#fff] border border-[#F1F2F2]"
                      }`}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-3xl">
                          {completedTasks[taskIndex + '-' + index] ? (
                            <IoIosCheckmark className="text-[#ffffff] rounded-md bg-[#43b05f]" />
                          ) : (
                            <FaTasks className="text-gray-300 rounded-md bg-[#808080]" />
                          )}
                        </span>
                        <p className="sm:text-base text-sm">{item.task_title}</p>
                      </div>
                      <div className="text-gray-100 text-xl font-semibold flex flex-row items-center gap-2">
                        <p className="sm:text-base text-sm">{item.task_points}</p>
                        <GiTwoCoins />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Task;
