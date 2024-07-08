import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiLight } from "react-icons/ci";
import { MdOutlineNightlightRound } from "react-icons/md";
import { useThemeContext } from "../context/ThemeContext.js";
import { useTelegramUser } from "../context/TelegramContext.js";
import fallbackImage from '../assets/fallback.png';
import { getTelegramProfilePicture, getTelegramUserInfo } from "../components/telegramUtils.js"; // Import the required functions

const Logo = () => {
  const { theme, setTheme } = useThemeContext();
  const userId = useTelegramUser();
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState("Anonymous");

  useEffect(() => {
    const fetchTelegramData = async () => {
      if (userId) {
        const profilePic = await getTelegramProfilePicture(userId);
        const userName = await getTelegramUserInfo(userId);
        setProfilePicture(profilePic || fallbackImage);
        setUserName(userName || "Anonymous");
      }
    };

    fetchTelegramData();
  }, [userId]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Link
      to="/"
      className="
        absolute sm:top-[1.5rem] top-[0.5rem] left-[1.5rem] [text-decoration:none] text-lg text-[#E9B454] sm:w-[95%] w-[85%] justify-between flex items-center mb-4 z-10"
    >
      <div className="flex flex-row gap-2 items-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-12 h-12 rounded-full"
          style={{ border: '2px solid #2ebd85' }} // Added inline style for the golden ring border
        />
        <span
          className={`uppercase font-bold ${
            theme === "dark" ? "text-[#E9B454]" : "text-[#010C0C]"
          }`}
        >
          {userName}
        </span>
      </div>

      <div
        onClick={(e) => toggleTheme(e)}
        className="bg-[#1B2B2A] p-2 rounded border border-gray-200"
      >
        {theme === "dark" ? (
          <CiLight
            onClick={(e) => toggleTheme(e)}
            className="transition duration-300 ease-in text-2xl font-semibold"
          />
        ) : (
          <MdOutlineNightlightRound
            onClick={(e) => toggleTheme(e)}
            className="transition duration-300 ease-in text-2xl font-semibold bg-indigo-500 text-white"
          />
        )}
      </div>
    </Link>
  );
};

export default Logo;
