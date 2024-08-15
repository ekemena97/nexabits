import React, { useState, useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import {
  useTelegramUser,
  useTelegramStartappParam as useTelegramReferrerId,
  useTelegramFirstName,
  useTelegramUsername,
  useTelegramIsBot,
  useTelegramIsPremium,
} from "../context/TelegramContext.js";
import { useReferralContext } from "../context/ReferralContext.js";
import { FaGift, FaCopy, FaThumbsUp, FaTrophy, FaChevronRight } from "react-icons/fa"; // Import the FaTrophy icon
import { GoPersonAdd } from "react-icons/go";
import { Link } from "react-router-dom"; // Import Link for navigation
import crypto from "../assets/crypto.png";

const Referrals = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser();
  const referrerId = useTelegramReferrerId();
  const firstName = useTelegramFirstName();
  const username = useTelegramUsername();
  const isBot = useTelegramIsBot();
  const isPremium = useTelegramIsPremium();

  const [copySuccess, setCopySuccess] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const { totalReferrals, successfulReferrals, ordinaryReferredUsers, premiumReferredUsers } = useReferralContext();

  useEffect(() => {
    if (userId) {
      console.log('userId in Referrals:', userId);
      setReferralLink(`https://t.me/NexaBit_Tap_bot/start?startapp=${userId}`);
    }
  }, [userId]);

  useEffect(() => {
    if (referrerId) {
      console.log('referrerId in Referrals:', referrerId);
    }
  }, [referrerId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
      console.log('Referral link copied to clipboard');
    });
  };

  const handleShareLink = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${referralLink}&text=${encodeURIComponent(
      "🎁 New and Hot! First Time Gift for Playing with Me\n💵 5K $Squad tokens as a first-time gift."
    )}`;
    window.open(telegramShareUrl, "_blank");
    console.log('Sharing referral link:', telegramShareUrl);
  };

  return (
    <section
      className={`h-full w-[90%] flex flex-col sm:mt-20 mt-12 mb-24 relative ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#19191E] to-[#232323] text-[#fff]"
          : "bg-[#fff] text-[#19191E]"
      } `}
    >
      <h1 className="sm:text-2xl text-xl my-3 text-center font-semibold text-gray-100">
        Referrals
      </h1>

      {/* Contest Button */}
      <Link
        to={`/leaderboard`}
        className="absolute flex items-center gap-2 p-2 text-white rounded-md text-lg font-bold cursor-pointer transition-transform duration-150 ease-in hover:bg-[#4A4FFF] hover:scale-105"
        style={{ top: '-2.9rem', right: '-0.3rem', zIndex: 1500 }}
      >
        <span className="inline-flex items-center gap-1" style={{ borderBottom: '2px solid purple' }}>
          <FaTrophy className="text-2xl" style={{ color: 'gold' }} /> Contest
          <FaChevronRight className="ml-0 text-lg" style={{ fontSize: '0.6rem' }} />
        </span>
        <span className="absolute text-xs text-yellow-300 animate-pulse" style={{ top: '2.5rem', right: '1rem' }}>
          Join Now!🔥
        </span>
      </Link>



      <div
        className={`w-full min-h-[70vh] sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide ${
          theme === "dark"
            ? "bg-[#19191E] text-[#fff]"
            : "bg-[#F1F2F2] text-[#19191E]"
        }`}
      >
        <div className="flex flex-col items-center sm:p-0 p-3 gap-3">
          <div className="flex flex-col gap-1 sm:w-[80%] w-full items-center py-0 justify-items-center">
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#19191E] text-[#fff]"
                  : "bg-[#F1F2F2] text-[#19191E]"
              } sm:text-6xl text-3xl font-semibold`}
            >
              Invite Friends
            </div>
            <div className="text-sm text-gray-100 text-center">
              You and your friends will receive bonuses
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#fff] border border-[#F1F2F2]"
            } flex flex-row sm:gap-4 gap-1 items-center px-6 sm:w-[80%] w-full py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300`}
          >
            <FaGift className="text-gray-100 sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-gray-100 text-sm">Invite a friend</div>
              <div className="text-gray-100 text-sm flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+5,000</span> for you and
                  your friend.
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#fff] border border-[#F1F2F2]"
            } flex flex-row sm:gap-4 gap-1 items-center px-6 sm:w-[80%] w-full py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300`}
          >
            <FaGift className="text-gray-100 sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-gray-100 text-sm">Invite Telegram Premium friend</div>
              <div className="text-gray-100 text-sm flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+10,000</span> for you and
                  your friend.
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full flex flex-col items-center">
            {copySuccess && (
              <div className="absolute top-2 text-red-500 flex items-center justify-center mt-4">
                <FaThumbsUp className="mr-2" />
                Copy Successful
              </div>
            )}

            <div
              className="sm:text-xl text-base font-semibold text-[#5A5FFF] cursor-pointer mt-2"
              onClick={handleCopyLink}
            >
              Tap here to copy your Unique link
            </div>

            <div className="flex flex-row items-center sm:w-[90%] w-[90%] mt-2">
              <div
                className={`${
                  theme === "dark"
                    ? "bg-[#232323] border border-gray-200"
                    : "bg-[#fff] border border-[#F1F2F2]"
                } flex flex-row sm:gap-4 gap-1 items-center px-6 py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300 text-gray-100 sm:w-full w-full`}
                onClick={handleCopyLink}
              >
                <h1 className="text-xs">{referralLink}</h1>
              </div>
              <FaCopy className="cursor-pointer" onClick={handleCopyLink} />
            </div>

            <div
              className="flex flex-row items-center justify-center gap-2 bg-[#5A5FFF] sm:text-xl text-base font-semibold text-[#fff] cursor-pointer py-4 px-8 rounded-md sm:w-[80%] w-full mt-2"
              onClick={handleShareLink}
            >
              <div>Share to your friends</div>
              <GoPersonAdd />
            </div>

            <div className="sm:w-[80%] w-full py-3">
              <div className="text-center">
                Friends: {totalReferrals}
              </div>
              <div className="text-center">
                Premium Friends: {premiumReferredUsers}
              </div>
              <div className="text-center">
                Successful Referrals: {successfulReferrals}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
