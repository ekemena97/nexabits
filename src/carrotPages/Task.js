import React, { useEffect } from "react";
import { realTasks } from "../data/index.js";
import { useThemeContext } from "../context/ThemeContext.js";
import { TbMilitaryRank } from "react-icons/tb";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosCheckmark } from "react-icons/io";
import { FaGift, FaCopy, FaThumbsUp, FaTrophy } from "react-icons/fa"; // Import the FaTrophy icon
import { Link } from "react-router-dom"; // Import Link for navigation
import logoSvg from "../assets/logo.svg";
import { FaTasks, FaBitcoin, FaCoins } from "react-icons/fa";
import { useTapContext } from "../context/TapContext.js";
import { useTaskContext } from "../context/TaskContext.js";
import { useTelegramUser } from "../context/TelegramContext.js";
import Task2 from "./Task2.js"; // Import Task2 component
import Referrals from "./Referrals.js";
import NftGrid from "../components/NftGrid.js";
import { FaRocket, FaEthereum, FaGlobe } from "react-icons/fa"; // Import Font Awesome icons
import { motion } from "framer-motion";
import wallet1 from "../assets/wallet1.png"; // Import wallet1 image
import wallet2 from "../assets/wallet2.png"; // Import wallet2 image

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN}/getChatMember`;
const TELEGRAM_GROUP_CHAT_ID = '@nexabitHQ';

const Task = () => {
  const { count, incrementPoints } = useTapContext();
  const { theme } = useThemeContext();
  const { completedTasks, timers, startTaskTimer, markTaskAsCompleted } = useTaskContext();
  const userId = useTelegramUser(); // Get userId from TelegramContext
  // Dynamically calculate the total number of tasks
  const totalTasks = realTasks.reduce((sum, task) => sum + (task.task?.length || 0), 0);

  useEffect(() => {
    const checkTelegramMembership = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${TELEGRAM_API_URL}?chat_id=${TELEGRAM_GROUP_CHAT_ID}&user_id=${userId}`);
        const data = await response.json();

        if (data.result && data.result.status === 'member' && !completedTasks['0-0']) {
          // Update the first task as completed and increment points
          markTaskAsCompleted('0-0');
          incrementPoints(parseInt(realTasks[0].task[0].task_points));
        }
      } catch (error) {
        console.error('Error checking Telegram membership:', error);
      }
    };

    checkTelegramMembership();
  }, [userId, markTaskAsCompleted, incrementPoints, completedTasks]);

  const handleTaskClick = (item, taskIndex, itemIndex) => {
    // Check if it is the first task of each task array
    if (taskIndex === 0 && itemIndex === 0) {
      // Do not use timers for the first task
      return;
    }
    
    if (completedTasks[taskIndex + "-" + itemIndex] || timers[taskIndex + "-" + itemIndex]) {
      return; // Task already completed or timer already set
    }

    const duration = (Math.floor(Math.random() * (60 - 10 + 1)) + 10) * 1000;
    startTaskTimer(taskIndex + "-" + itemIndex, duration);
  };

  // Function to format number with commas
  const formatCount = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section
      className="h-screen w-[90%] mx-auto flex flex-col mt-4 relative font-inter overflow-hidden"
    >
      <div className="h-[calc(100vh-130px)] overflow-auto scrollbar-hide">
        {/*<div>
          <NftGrid totalTasks={totalTasks} /> 
        </div> */}

       {/* Coins pumping out from the background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * 100 + '%', // Random start position
                y: "100%", // Start off-screen at the bottom
                opacity: 0,
              }}
              animate={{
                y: "-10%", // Move upward
                opacity: [0, 1, 0], // Fade in and out
                scale: [0.8, 1.2, 1], // Slight scale effect
              }}
              transition={{
                duration: Math.random() * 2 + 2, // Random duration
                repeat: Infinity,
                delay: Math.random() * 2, // Staggered start
              }}
              style={{
                fontSize: `${Math.random() * 0.8 + 0.8}rem`, // Random sizes
                color: ["#fddc00", "#0098ea", "#5a5fff"][Math.floor(Math.random() * 3)], // Random coin colors
              }}
            >
              {[<FaBitcoin />, <FaEthereum />, <FaCoins />][Math.floor(Math.random() * 3)]}
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div 
          className="text-center justify-center items-start leading-tight text-xs mt-2 px-2 py-2 rounded-lg shadow-lg relative z-10" 
          style={{
            backgroundColor: "#1E23371A", // Semi-transparent background
            // border: "1px solid #0098ea",  Thin, vibrant border
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)", // Subtle shadow for depth
          }}
        >
          <motion.p 
            className="text-sm font-bold text-[#fddc00] text-left flex items-center gap-2 px-1 mr-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            🌟 Be the First to Experience the Future of NFT on the TON Ecosystem.
          </motion.p>

          <motion.p 
            className="text-xs text-center text-[#dbe2eb] px-2 py-2 border-l-4 border-[#0098ea] flex items-start gap-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{ x: 10 }}
          >
            🔗 Each NFT captures your crypto activity progress, growing and adapting as you gain knowledge and master new tactics. Powered by Augmented Reality!.
          </motion.p>

          <motion.p 
            className="text-sm font-bold text-center text-[#5a5fff] flex items-center gap-2 px-2 py-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
          >
            🔗 Hang your evolving NFT on the wall and witness it come to life at home. Start now!
          </motion.p>
        </div>
 

        <div
          className="w-full rounded overflow-y-scroll scrollbar-hide"
        >
          {realTasks.map((task, taskIndex) => (
            <div key={taskIndex} className="flex mx-auto flex-col gap-3 items-center pt-5">
              <div className="flex flex-row justify-between sm:w-[90%]">
                <div className="flex sm:flex-row flex-col gap-3 sm:items-center items-start">
                  <div className="flex w-full flex-col gap-2 sm:px-0">
                    <h1 className="sm:text-xs text-sm text-center font-bold -mt-4 p-2">
                      <span className="text-lg">Task 1 -</span> {task.title}
                    </h1>
                  </div>
                </div>
                <div className="sm:flex hidden justify-center flex-row mx-4">
                  <img src={logoSvg} alt="CryptoBucks" className={`w-24 ${theme === "dark" ? "bg-[#E9B454]" : "bg-[#AC9053]"}`} />
                </div>
              </div>

              {/* Contest Button */}
              {/*<Link
                to={`/leaderboard`}
                className="absolute flex items-center gap-2 p-2 text-white rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-[#4A4FFF]"
                style={{ top: '-2rem', right: '0.5rem', zIndex: 1500 }} // Custom positioning
              >
                <FaTrophy className="text-lg" /> Contest
              </Link> */}

              {/* Tasks */}
              <div className="flex flex-col gap-2 px-4 sm:w-[70%]">
                {task?.task?.map((item, itemIndex) => (
                  <a
                    href={item.task_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={itemIndex}
                    className="no-underline"
                    onClick={() => handleTaskClick(item, taskIndex, itemIndex)}
                  >
                    <div
                      className="px-4 py-2 rounded-md flex flex-row items-center justify-between cursor-pointer border border-purple bg-black/15"
                    >
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-2xl">
                          {completedTasks[taskIndex + "-" + itemIndex] ? (
                            <IoIosCheckmark className="text-[#ffffff] rounded-md bg-[#43b05f]" />
                          ) : (
                            <FaTasks className="rounded-md text-blue" />
                          )}
                        </span>
                        <p className="sm:text-base text-sm text-gray ">{item.task_title}</p>
                      </div>
                      <div className="text-gray-100 text-lg font-semibold flex flex-row items-center gap-2">
                        <p className="sm:text-base text-sm ml-16 text-white">{formatCount(item.task_points)}</p>
                        <GiTwoCoins className=" text-gold" />
                      </div>
                    </div>
                  </a>
                ))}

              </div>
            </div>
          ))}
        </div>

        {/* Task 2 Component */}
        <Task2 
          incrementPoints={incrementPoints} // Pass incrementPoints function to Task2
          markTaskAsCompleted={markTaskAsCompleted} // Pass markTaskAsCompleted function to Task2
        />      

        {/* Referral Check */}

        <Referrals /> 
      </div>     

    </section>
  );
};

export default Task;
