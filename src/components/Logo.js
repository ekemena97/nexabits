import React, { useEffect, useState, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext.js";
import { useTelegramUser } from "../context/TelegramContext.js";
import fallbackImage from '../assets/fallback.png';
import profilePic2 from '../assets/profile.jpg';
import { getTelegramProfilePicture, getTelegramUserInfo } from "../components/telegramUtils.js"; // Import the required functions

const Logo = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser();
  const [profilePicture, setProfilePicture] = useState(fallbackImage);
  const [userName, setUserName] = useState("Anonymous");
  const prevProfilePicture = useRef(null);
  const isMounted = useRef(false);
  const telegramProfilePic = useRef(null);

  useEffect(() => {
    isMounted.current = true;

    const fetchTelegramData = async () => {
      if (userId) {
        const profilePic = await getTelegramProfilePicture(userId);
        const userName = await getTelegramUserInfo(userId);

        if (isMounted.current) {
          if (profilePic) {
            telegramProfilePic.current = profilePic;
            setProfilePicture(profilePic);
            prevProfilePicture.current = profilePic;
          }

          setUserName(userName || "Anonymous");
        }
      }
    };

    fetchTelegramData();

    return () => {
      isMounted.current = false;
    };
  }, [userId]);

  useEffect(() => {
    let timerId;

    const updateProfilePicture = () => {
      if (isMounted.current) {
        setProfilePicture(telegramProfilePic.current || fallbackImage);
        timerId = setTimeout(() => {
          setProfilePicture(profilePic2);
          timerId = setTimeout(() => {
            setProfilePicture(fallbackImage);
            timerId = setTimeout(() => {
              setProfilePicture(telegramProfilePic.current || fallbackImage);
              updateProfilePicture(); // Restart the cycle
            }, 180000); // 3 minute for fallbackImage
          }, 60000); // 1 minutes for profilePic2
        }, 30000); // 30 seconds for telegram profile picture
      }
    };

    updateProfilePicture();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
      <div className="flex flex-col gap-3 items-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-9 h-9 rounded-full"
          style={{ border: '1px solid #2ebd85' }} // Added inline style for the golden ring border
        />
        <span
          className={`font-bold ${
            theme === "dark" ? "text-[#E9B454]" : "text-[#010C0C]"
          }`}
          style={{ fontSize: '0.4rem', marginTop: '-0.7rem' }} // Inline style to reduce the font size
        >
          {userName}
        </span>
      </div>
    
  );
};

export default memo(Logo);
